"use strict"

var _dao = require('./dao');
var _sql = require('./sqlMapping');
var async = require('async');

var jsonWrite = _dao.jsonWrite;
var dbcode = _dao.dbcode;

module.exports = {
  listresult: function (res, err, result) {
    console.log('dbresult', err, result);
    if (err) {
      jsonWrite(res, {}, dbcode.FAIL);
    } else {
      var dbresult = [];
      var head = result.metaData;
      dbresult = result.rows.map((r) => {
        var json = {};
        r.map((r1, i) => {
          json[head[i].name] = r1;
        })
        return json;
      })
      jsonWrite(res, dbresult, dbcode.SUCCESS);
    }
  },
  getOrder: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao getOrder');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getorder;
      var where_params = [];
      if (param.orderno) {
        sqlstring += "WHERE TC_AFR02=:orderno"
        where_params = [param.orderno]
      } else {
        sqlstring += "WHERE to_char(tc_afr01,'YYYY-MM-DD') >= :begindate AND to_char(tc_afr01,'YYYY-MM-DD') <= :enddate"
        where_params = [param.beginDate, param.endDate]
      }
      connection.execute(sqlstring, where_params, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  getOrderDetail: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao getOrderDetail');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getorderdetail;
      var where_params = [param.order];
      connection.execute(sqlstring, where_params, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  login: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao login');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.login;
      var where_params = [param.username, param.password];
      connection.execute(sqlstring, where_params, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  getTodayTask: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao getTodayTask');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      console.log('infoDao getTodayTask1');
      var sqlstring = _sql.gettodaytask;
      var where_params = [param.today];
      connection.execute(sqlstring, where_params, function (err, result) {

        console.log('infoDao getTodayTask2');
        context.listresult(res, err, result);

        console.log('infoDao getTodayTask3');
        connection.release();
      });
    });
  },
  getTaskState: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao getTaskState');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.gettaskstate;
      var where_params = [param.today];
      connection.execute(sqlstring, where_params, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  updateTaskState: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao updateTaskState');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring;
      if (param.type == "begintask") {
        sqlstring = _sql.begintask;
      } else {
        sqlstring = _sql.endtask;
      }
      var where_params = [param.time, param.today, param.orderno, param.dh, param.xh, param.user, param.step];
      console.log(sqlstring, where_params);
      connection.execute(sqlstring, where_params, function (err, result) {
        console.log('dbresult', err, result);
        if (err) {
          jsonWrite(res, {}, dbcode.FAIL);
        } else {
          jsonWrite(res, req.body.data, dbcode.SUCCESS);
        }
        connection.release();
      });
    });
  },
  getTaskInfo: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao getTaskInfo');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.gettaskinfo;
      var where_params = [param.orderno, param.today, param.dh, param.xh];
      connection.execute(sqlstring, where_params, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  getWlqd: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao getWlqd');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getwlqd;
      var where_params = [param.today, param.orderno, param.gy];
      connection.execute(sqlstring, where_params, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  updateWlqd: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao updateWlqd', req.body.data);
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.updatewlqd;
      var tasks = [];
      for (let i = 0; i < param.wlqd.length; i++) {
        let lj = param.wlqd[i];
        tasks.push(function (callback) {
          var where_params = [lj.TC_AFI09 || "", lj.TC_AFI10 || "", lj.TC_AFI11 || "", lj.TC_AFI12 || "", param.today, param.orderno, param.gy, lj.TC_AFI04];
          console.log(sqlstring, where_params)
          connection.execute(sqlstring, where_params, function (err, result) {
            callback(err);
          })
        })
      }
      async.series(tasks, function (err, results) {
        if (err) {
          console.log('tasks error', err);
          connection.rollback(); // 发生错误事务回滚
          jsonWrite(res, {}, dbcode.FAIL);
        } else {
          jsonWrite(res, param, dbcode.SUCCESS);
        }
        connection.release();
      });
    });
  },
  getSbtj: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao getSbtj');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getsbtj;
      var where_params = [param.today, param.orderno, param.dh, param.xh, param.user];
      connection.execute(sqlstring, where_params, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  updateSbtj: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao updateSbtj', req.body.data);
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.updatesbtj;
      var tasks = [];
      for (let i = 0; i < param.sbtj.length; i++) {
        let lj = param.sbtj[i];
        tasks.push(function (callback) {
          var where_params = [param.today, param.orderno, param.ordertype, lj.TC_AFJ04, lj.TC_AFJ05, lj.TC_AFJ06, lj.TC_AFJ07, lj.TC_AFJ08, param.dh, param.xh, param.user == 'tiptop' ? 1 : 2, param.user];
          console.log(sqlstring, where_params)
          connection.execute(sqlstring, where_params, function (err, result) {
            callback(err);
          })
        })
      }
      async.series(tasks, function (err, results) {
        if (err) {
          console.log('tasks error', err);
          connection.rollback(); // 发生错误事务回滚
          jsonWrite(res, {}, dbcode.FAIL);
        } else {
          jsonWrite(res, param, dbcode.SUCCESS);
        }
        connection.release();
      });
    });
  },
  getSjqr: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao getSjqr');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getsjqr;
      var where_params = [param.today, param.orderno, param.dh, param.xh,param.user];
      connection.execute(sqlstring, where_params, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  updateSjqr: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao updateSjqr', req.body.data);
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.updatesjqr;
      var lj = param.sjqr;
      var where_params = [lj.TC_AFK04, lj.TC_AFK05 || "", lj.TC_AFK06, lj.TC_AFK07 || "", lj.TC_AFK08, lj.TC_AFK09 || "", lj.TC_AFK10, lj.TC_AFK11 || "", param.today, param.orderno, param.dh, param.xh,param.user];
      console.log(sqlstring, where_params)
      connection.execute(sqlstring, where_params, function (err, result) {
        if (err) {
          console.log('updateSjqr error', err);
          jsonWrite(res, {}, dbcode.FAIL);
        } else {
          jsonWrite(res, param, dbcode.SUCCESS);
        }
        connection.release();
      })
    });
  },
  getZssc: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao getZssc');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getzssc;
      console.log(sqlstring);
      var where_params = [param.today, param.orderno, param.dh, param.xh,param.user];
      connection.execute(sqlstring, where_params, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  updateZssc: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao updateZssc', req.body.data);
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.updatezssc;
      var lj = param.zssc;
      var where_params = [lj.TC_AFL04, lj.TC_AFL05, lj.TC_AFL06, param.today, param.orderno, param.dh, param.xh,param.user];
      console.log(sqlstring, where_params)
      connection.execute(sqlstring, where_params, function (err, result) {
        if (err) {
          console.log('updateZssc error', err);
          jsonWrite(res, {}, dbcode.FAIL);
        } else {
          jsonWrite(res, param, dbcode.SUCCESS);
        }
        connection.release();
      })
    });
  },
  getBgsj: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao getBgsj', req.body.data);
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var tasks = [];
      var bgsj = {};
      var bghis = 0;
      var begintime = "";
      var bgsj_lp = {};
      var bgsj_bl = [];
      var bgsj_blyy = [];
      var bgsj_bllj = [];
      var bgsj_blph = [];
      tasks.push(function (callback) {
        var sqlstring = _sql.getbgsj;
        var where_params = [param.today, param.orderno, param.dh, param.xh,param.user];
        console.log(sqlstring, where_params)
        connection.execute(sqlstring, where_params, function (err, result) {
          if (!err) {
            var dbresult = [];
            var head = result.metaData;
            dbresult = result.rows.map((r) => {
              var json = {};
              r.map((r1, i) => {
                json[head[i].name] = r1;
              })
              return json;
            })
            if (dbresult.length > 0) {
              bgsj = dbresult[0];
            }
          }
          callback(err);
        })
      })
      tasks.push(function (callback) {
        var sqlstring = _sql.getbghis;
        var where_params = [param.today, param.orderno, param.dh, param.xh,param.user];
        console.log(sqlstring, where_params)
        connection.execute(sqlstring, where_params, function (err, result) {
          if (!err) {
            var dbresult = [];
            var head = result.metaData;
            dbresult = result.rows.map((r) => {
              var json = {};
              r.map((r1, i) => {
                json[head[i].name] = r1;
              })
              return json;
            })
            console.log('getbghis',dbresult);
            if (dbresult.length > 0) {
              bghis = dbresult[0].ALLHIS || 0;
            }
          }
          callback(err);
        })
      })
      tasks.push(function (callback) {
        var sqlstring = _sql.getbgsj_begintime;
        var where_params = [param.today, param.orderno, param.dh, param.xh,param.user];
        console.log(sqlstring, where_params)
        connection.execute(sqlstring, where_params, function (err, result) {
          if (!err) {
            var dbresult = [];
            var head = result.metaData;
            dbresult = result.rows.map((r) => {
              var json = {};
              r.map((r1, i) => {
                json[head[i].name] = r1;
              })
              return json;
            })
            console.log('getbgsj_begintime',dbresult);
            if (dbresult.length > 0) {
              begintime = dbresult[0].TC_AFQ06;
            }
          }
          callback(err);
        })
      })
      // tasks.push(function (callback) {
      //   var sqlstring = _sql.getbgsj_lp;
      //   var where_params = [param.today, param.orderno, param.dh, param.xh,param.user];
      //   console.log(sqlstring, where_params)
      //   connection.execute(sqlstring, where_params, function (err, result) {
      //     if (!err) {
      //       var dbresult = [];
      //       var head = result.metaData;
      //       dbresult = result.rows.map((r) => {
      //         var json = {};
      //         r.map((r1, i) => {
      //           json[head[i].name] = r1;
      //         })
      //         return json;
      //       })
      //       if (dbresult.length > 0) {
      //         bgsj_lp = dbresult[0];
      //       }
      //     }
      //     callback(err);
      //   })
      // })
      // tasks.push(function (callback) {
      //   var sqlstring = _sql.getbgsj_bl;
      //   var where_params = [param.today, param.orderno, param.dh, param.xh,param.user];
      //   console.log(sqlstring, where_params)
      //   connection.execute(sqlstring, where_params, function (err, result) {
      //     if (!err) {
      //       var dbresult = [];
      //       var head = result.metaData;
      //       dbresult = result.rows.map((r) => {
      //         var json = {};
      //         r.map((r1, i) => {
      //           json[head[i].name] = r1;
      //         })
      //         return json;
      //       })
      //       bgsj_bl = dbresult;
      //     }
      //     callback(err);
      //   })
      // })
      tasks.push(function (callback) {
        var sqlstring = _sql.getbgsj_blyy;
        console.log(sqlstring)
        connection.execute(sqlstring, [], function (err, result) {
          if (!err) {
            var dbresult = [];
            var head = result.metaData;
            dbresult = result.rows.map((r) => {
              var json = {};
              r.map((r1, i) => {
                json[head[i].name] = r1;
              })
              return json;
            })
            bgsj_blyy = dbresult;
          }
          callback(err);
        })
      })
      tasks.push(function (callback) {
        var sqlstring = _sql.getbgsj_bllj;
        var where_params = [param.orderno];
        console.log(sqlstring, where_params)
        connection.execute(sqlstring, where_params, function (err, result) {
          if (!err) {
            var dbresult = [];
            var head = result.metaData;
            dbresult = result.rows.map((r) => {
              var json = {};
              r.map((r1, i) => {
                json[head[i].name] = r1;
              })
              return json;
            })
            bgsj_bllj = dbresult;
          }
          callback(err);
        })
      })
      tasks.push(function (callback) {
        var sqlstring = _sql.getbgsj_blph;
        var where_params = [param.today, param.orderno];
        console.log(sqlstring, where_params)
        connection.execute(sqlstring, where_params, function (err, result) {
          if (!err) {
            var dbresult = [];
            var head = result.metaData;
            dbresult = result.rows.map((r) => {
              var json = {};
              r.map((r1, i) => {
                json[head[i].name] = r1;
              })
              return json;
            })
            bgsj_blph = dbresult;
          }
          callback(err);
        })
      })
      async.series(tasks, function (err, results) {
        if (err) {
          console.log('tasks error', err);
          connection.rollback(); // 发生错误事务回滚
          jsonWrite(res, {}, dbcode.FAIL);
        } else {
          jsonWrite(res, { bgsj, bgsj_lp, bgsj_bl, bgsj_blyy, bgsj_bllj, bgsj_blph,bghis,begintime }, dbcode.SUCCESS);
        }
        connection.release();
      });
    });
  },
  updateBgsj: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao updateBgsj', req.body.data);
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var tasks = [];
      tasks.push(function (callback) {
        var sqlstring = _sql.updatebgsj_lp;
        var bgsj_lp = param.bgsj_lp;
        var where_params = [param.today, param.orderno, param.ordertype, bgsj_lp.TC_AFM04, param.dw,param.dh, param.xh,param.user == 'tiptop' ? 1 : 2,param.user,
          param.zssc_begin,param.zssc_end,param.begintime,param.endtime,param.zssc_count];
        console.log(sqlstring, where_params)
        connection.execute(sqlstring, where_params, function (err, result) {
          callback(err);
        })
      })

      var sqlstring = _sql.updatebgsj_bl;
      var bgsj_bl = param.bgsj_bl;
      for (let i = 0; i < bgsj_bl.length; i++) {
        let bl = bgsj_bl[i];
        tasks.push(function (callback) {
          var where_params = [param.today, param.orderno, param.ordertype,bl.TC_AFN04, bl.TC_AFN05, parseInt(bl.TC_AFN06), bl.TC_AFN07, bl.TC_AFN08, bl.TC_AFN09, bl.TC_AFN10, bl.TC_AFN11,param.dh, param.xh,param.user == 'tiptop' ? 1 : 2,param.user,
        param.zssc_begin,param.zssc_end,param.begintime,param.endtime];
          console.log(sqlstring, where_params)
          connection.execute(sqlstring, where_params, function (err, result) {
            callback(err);
          })
        })
      }

      async.series(tasks, function (err, results) {
        if (err) {
          console.log('tasks error', err);
          connection.rollback(); // 发生错误事务回滚
          jsonWrite(res, {}, dbcode.FAIL);
        } else {
          jsonWrite(res, param, dbcode.SUCCESS);
        }
        connection.release();
      });
    });
  },
  continueTaskState: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao continueTaskState', req.body.data);
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var tasks = [];
      tasks.push(function (callback) {
        var sqlstring = _sql.resettaskstate;
        var where_params = [param.today, param.orderno, param.dh, param.xh,param.user];
        console.log(sqlstring, where_params)
        connection.execute(sqlstring, where_params, function (err, result) {
          callback(err);
        })
      })

      tasks.push(function (callback) {
        var sqlstring = _sql.restartzssc;
        var where_params = [param.today, param.orderno, param.dh, param.xh,param.user];
        console.log(sqlstring, where_params)
        connection.execute(sqlstring, where_params, function (err, result) {
          callback(err);
        })
      })

      async.series(tasks, function (err, results) {
        if (err) {
          console.log('tasks error', err);
          connection.rollback(); // 发生错误事务回滚
          jsonWrite(res, {}, dbcode.FAIL);
        } else {
          jsonWrite(res, param, dbcode.SUCCESS);
        }
        connection.release();
      });
    });
  },
  getLqlist: function(req,res,next) {
    console.log('infoDao getLqlist');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getlqlist;
      console.log("getLqlist",sqlstring,param.cjbh);
      connection.execute(sqlstring, [param.cjbh], function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  getCjlist: function(req,res,next) {
    console.log('infoDao getCjlist');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getcjlist;
      connection.execute(sqlstring, [], function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  getBrlist: function(req,res,next) {
    console.log('infoDao getbrlist');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getbrlist;
      var where_params = [];
      console.log(sqlstring);
      connection.execute(sqlstring, where_params, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  addBrinfo: function(req,res,next) {
    console.log('infoDao addBrinfo');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.addbrinfo;
      var nowDate = new Date();
      var paramlist = [param.lqbh,param.lqmc,param.lqxh,parseInt(param.lqsl),nowDate.Format("yyyy-MM-dd"),nowDate.Format("hh:mm:ss"),param.jcgh,param.cjbh]
      console.log(paramlist);
      connection.execute(sqlstring, paramlist, function (err, result) {
        if (err) {
          console.log('addBrinfo error', err);
          jsonWrite(res, {}, dbcode.FAIL);
        } else {
          jsonWrite(res, param, dbcode.SUCCESS);
        }
        connection.release();
      });
    });
  },
  updateRtinfo: function(req,res,next) {
    console.log('infoDao updateRtinfo');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.updatertinfo;
      var nowDate = new Date();
      var paramlist = [nowDate.Format("yyyyMMdd"),nowDate.Format("hh:mm:ss"),param.rtgh,param.lqbh,param.lqxh,param.jcrq,param.jcsj]
      console.log(paramlist);
      connection.execute(sqlstring, paramlist, function (err, result) {
        if (err) {
          console.log('updateRtinfo error', err);
          jsonWrite(res, {}, dbcode.FAIL);
        } else {
          jsonWrite(res, param, dbcode.SUCCESS);
        }
        connection.release();
      });
    });
  },
  getSblist: function(req,res,next) {
    console.log('infoDao getsblist');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getsblist;
      connection.execute(sqlstring, [], function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  getGdlist: function(req,res,next) {
    console.log('infoDao getGdlist');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getgdlist;
      connection.execute(sqlstring, [new Date().Format('yyyy-MM-dd')], function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  getBxlist: function(req,res,next) {
    console.log('infoDao getbxlist');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getbxlist;
      var where_params = [];
      console.log(sqlstring);
      connection.execute(sqlstring, where_params, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  addBxinfo: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao addBxinfo', req.body.data);
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var tasks = [];
      var todayDate = new Date();
      tasks.push(function (callback) {
        var sqlstring = _sql.addbxinfo;
        var where_params = [param.sbbh,param.sbmc,param.sbwz,param.gzsm,todayDate.Format('yyyy-MM-dd'),todayDate.Format('hh:mm:ss'),param.user,
        param.gdgd,param.gdgy,param.gddh,param.gdxh,param.gdlx];
        console.log(sqlstring, where_params)
        connection.execute(sqlstring, where_params, function (err, result) {
          callback(err);
        })
      })

      tasks.push(function (callback) {
        var sqlstring = _sql.addbxstatus;
        var where_params = [param.sbbh,param.sbmc,todayDate.Format('yyyy-MM-dd'),todayDate.Format('hh:mm:ss'),'A',1,todayDate.Format('yyyy-MM-dd'),'',todayDate.Format('yyyy-MM-dd'),''];
        console.log(sqlstring, where_params)
        connection.execute(sqlstring, where_params, function (err, result) {
          callback(err);
        })
      })

      tasks.push(function (callback) {
        var sqlstring = _sql.addbxstatus;
        var where_params = [param.sbbh,param.sbmc,todayDate.Format('yyyy-MM-dd'),todayDate.Format('hh:mm:ss'),'B',0,todayDate.Format('yyyy-MM-dd'),'',todayDate.Format('yyyy-MM-dd'),''];
        console.log(sqlstring, where_params)
        connection.execute(sqlstring, where_params, function (err, result) {
          callback(err);
        })
      })

      async.series(tasks, function (err, results) {
        if (err) {
          console.log('tasks error', err);
          connection.rollback(); // 发生错误事务回滚
          jsonWrite(res, {}, dbcode.FAIL);
        } else {
          jsonWrite(res, param, dbcode.SUCCESS);
        }
        connection.release();
      });
    });
  },
  getFplist: function(req,res,next) {
    console.log('infoDao getFplist');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getfplist;
      var where_params = [];
      console.log(sqlstring);
      connection.execute(sqlstring, where_params, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  updateZpinfo: function(req,res,next) {
    console.log('infoDao updateZpinfo');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.updatezpinfo;
      var paramlist = [param.zpry,param.sbbh,param.bxdate,param.bxtime]
      console.log(sqlstring,paramlist);
      connection.execute(sqlstring, paramlist, function (err, result) {
        if (err) {
          console.log('updateZpinfo error', err);
          jsonWrite(res, {}, dbcode.FAIL);
        } else {
          jsonWrite(res, param, dbcode.SUCCESS);
        }
        connection.release();
      });
    });
  },
  updateBxstatus: function(req,res,next) {
    console.log('infoDao updateBxstatus');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = "";
      if(param.bxtype == 2){
        sqlstring = _sql.updatebxstatus_begin;
      }else{
        sqlstring = _sql.updatebxstatus_end;
      }
      var nowDate = new Date();
      var paramlist = [nowDate.Format("yyyy-MM-dd"),nowDate.Format("hh:mm:ss"),param.bxtype,param.sbbh,param.bxdate,param.bxtime,param.bxstatus]
      console.log(sqlstring,paramlist);
      connection.execute(sqlstring, paramlist, function (err, result) {
        if (err) {
          console.log('updateBxstatus error', err);
          jsonWrite(res, {}, dbcode.FAIL);
        } else {
          jsonWrite(res, param, dbcode.SUCCESS);
        }
        connection.release();
      });
    });
  },
  updateWxinfo: function(req,res,next) {
    console.log('infoDao updateWxinfo');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.updatewxinfo;
      var paramlist = [param.wxnr,param.sbbh,param.bxdate,param.bxtime]
      console.log(sqlstring,paramlist);
      connection.execute(sqlstring, paramlist, function (err, result) {
        if (err) {
          console.log('updateWxinfo error', err);
          jsonWrite(res, {}, dbcode.FAIL);
        } else {
          jsonWrite(res, param, dbcode.SUCCESS);
        }
        connection.release();
      });
    });
  },
};
