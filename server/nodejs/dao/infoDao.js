"use strict"

var _dao = require('./dao');
var _sql = require('./sqlMapping');
var async = require('async');
var moment = require('moment');

var jsonWrite = _dao.jsonWrite;
var dbcode = _dao.dbcode;

module.exports = {
  listresult: function (res, err, result, nCount) {
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
      jsonWrite(res, dbresult, dbcode.SUCCESS, nCount);
    }
  },
  getlistResult: function (result) {
    console.log('getlistResult', result);
    var head = result.metaData;
    return result.rows.map((r) => {
      var json = {};
      r.map((r1, i) => {
        json[head[i].name] = r1;
      })
      return json;
    })
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
    console.log('infoDao getTodayTask');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.gettodaytask;
      var where_params = [param.today];
      console.log(sqlstring, where_params);
      connection.execute(sqlstring, where_params, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  getAbmList: function (req, res, next) {
    //var pool = _dao.getPool();
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getabmlist;
      var where_params = [];
      connection.execute(sqlstring, where_params, function (err, result) {
        context.listresult(res, err, result);
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

      var tasks = [];
      var rwbh = "";
      for (let i = 0; i < param.wlqd.length; i++) {
        let lj = param.wlqd[i];
        tasks.push(function (callback) {
          var sqlstring = _sql.updatewlqd;
          var where_params = [lj.TC_AFI09 || "", lj.TC_AFI10 || "", lj.TC_AFI11 || "", lj.TC_AFI12 || "", param.today, param.orderno, param.gy, lj.TC_AFI04];
          console.log(sqlstring, where_params)
          connection.execute(sqlstring, where_params, function (err, result) {
            callback(err);
          })
        })
      }
      tasks.push(function (callback) {
        var sqlstring = _sql.getRwbh;
        var where_params = [param.today, param.orderno, param.dh, param.xh, param.useraccount];
        console.log(sqlstring, where_params)
        connection.execute(sqlstring, where_params, function (err, result) {
          if (!err && result.rows.length > 0 && result.rows[0].length > 0) {
            rwbh = result.rows[0][0];
          }
          callback(err);
        })
      })

      tasks.push(function (callback) {
        var sqlstring = _sql.updatewlqd_pg;
        var where_params = [rwbh, param.today];
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
  getSbtj_n: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao getSbtj_n');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getsbtj_n;
      var where_params = [param.today, param.orderno, param.dh, param.xh, param.user == 'tiptop' ? 1 : 2, param.user];
      connection.execute(sqlstring, where_params, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  updateSbtj_n: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao updateSbtj_n', req.body.data);
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var tasks = [];
      var rwbh = "";
      var sbtj = param.sbtj;
      sbtj.forEach(s => {
        tasks.push(function (callback) {
          var sqlstring = _sql.updatesbtj_n;
          var where_params = [s.TC_ABI12, param.today, param.orderno, param.dh, param.xh, param.user == 'tiptop' ? 1 : 2, param.user, s.TC_ABI08, s.TC_ABI10];
          console.log(sqlstring, where_params)
          connection.execute(sqlstring, where_params, function (err, result) {
            callback(err);
          })
        })
      })

      tasks.push(function (callback) {
        var sqlstring = _sql.getRwbh;
        var where_params = [param.today, param.orderno, param.dh, param.xh, param.user];
        console.log(sqlstring, where_params)
        connection.execute(sqlstring, where_params, function (err, result) {
          if (!err && result.rows.length > 0 && result.rows[0].length > 0) {
            rwbh = result.rows[0][0];
          }
          callback(err);
        })
      })

      tasks.push(function (callback) {
        var sqlstring = _sql.updatesbtj_pg;
        var where_params = [rwbh, param.today];
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
  getSjqr: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao getSjqr');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getsjqr;
      var where_params = [param.today, param.orderno, param.dh, param.xh, param.user];
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
      var where_params = [lj.TC_AFK04, lj.TC_AFK05 || "", lj.TC_AFK06, lj.TC_AFK07 || "", lj.TC_AFK08, lj.TC_AFK09 || "", lj.TC_AFK10, lj.TC_AFK11 || "", param.today, param.orderno, param.dh, param.xh, param.user];
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
  getSjqr_n: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao getSjqr_n');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getsjqr_n;
      var where_params = [param.today, param.orderno, param.dh, param.xh, param.user == 'tiptop' ? 1 : 2, param.user];
      connection.execute(sqlstring, where_params, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  updateSjqr_n: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao updateSjqr_n', req.body.data);
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var tasks = [];
      var sjqr_wlqr = param.sjqr_wlqr;
      var sjqr_sbcs = param.sjqr_sbcs;
      var sjqr_cpzl = param.sjqr_cpzl;
      var sjqr = sjqr_wlqr.concat(sjqr_sbcs, sjqr_cpzl);
      sjqr.forEach(s => {
        tasks.push(function (callback) {
          var sqlstring = _sql.updatesjqr_n;
          var where_params = [s.TC_ABG15, s.TC_ABG16, param.today, param.orderno, param.dh, param.xh, param.user == 'tiptop' ? 1 : 2, param.user, s.TC_ABG08, s.TC_ABG10];
          console.log(sqlstring, where_params)
          connection.execute(sqlstring, where_params, function (err, result) {
            callback(err);
          })
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
  getXj: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao getXj');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var tasks = [];
      var xjresult;
      var xjcount = 0;
      tasks.push(function (callback) {
        var sqlstring = _sql.getxjcount;
        var where_params = [param.today, param.orderno, param.dh, param.xh, param.user == 'tiptop' ? 1 : 2, param.user];
        console.log('getxjcount', sqlstring, where_params);
        connection.execute(sqlstring, where_params, function (err, result) {
          console.log('getxjcount res:', err, result);
          if (!err) {
            xjcount = result.rows[0][0];
          }
          callback(err);
          // context.listresult(res, err, result);
          // connection.release();
        });
      })
      tasks.push(function (callback) {
        var sqlstring = _sql.getxj;
        var where_params = [param.today, param.orderno, param.dh, parseInt(param.xh), param.user == 'tiptop' ? '1' : '2', param.user, xjcount + 1];
        console.log('getxj', sqlstring, where_params);
        connection.execute(sqlstring, where_params, function (err, result) {
          console.log('getxj res:', err, result);
          xjresult = result;
          callback(err);
          // context.listresult(res, err, result);
          // connection.release();
        });
      })
      async.series(tasks, function (err, results) {
        if (err) {
          console.log('tasks error', err);
          connection.rollback(); // 发生错误事务回滚
          jsonWrite(res, {}, dbcode.FAIL);
        } else {
          context.listresult(res, err, xjresult, xjcount);
          //jsonWrite(res, param, dbcode.SUCCESS);
        }
        connection.release();
      });
    });
  },
  updateXj: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao updateXj', req.body.data);
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var tasks = [];
      var sjqr_wlqr = param.sjqr_wlqr;
      var sjqr_sbcs = param.sjqr_sbcs;
      var sjqr_cpzl = param.sjqr_cpzl;
      var sjqr = sjqr_wlqr.concat(sjqr_sbcs, sjqr_cpzl);
      var sizeInput = param.sizeInput || [];

      tasks.push(function (callback) {
        var sqlstring = _sql.insertcyxj;
        var where_params = [
          param.today,
          param.orderno,
          param.ordertype,
          param.dh,
          param.xh,
          param.user == 'tiptop' ? 1 : 2,
          param.user,
          param.starttime,
          param.endtime,
          param.xj_cc || param.xj,
          param.xjtimes + 1,
          param.xj_wg || 0,
          param.xj_xn || 0
        ];
        console.log(sqlstring, where_params)
        connection.execute(sqlstring, where_params, function (err, result) {
          callback(err);
        })
      })

      sjqr.forEach(s => {
        tasks.push(function (callback) {
          var sqlstring = _sql.updatexj;
          var where_params = [s.TC_ABL15, s.TC_ABL16, param.today, param.orderno, param.dh, param.xh, param.user == 'tiptop' ? 1 : 2, param.user, s.TC_ABL08, s.TC_ABL10];
          console.log(sqlstring, where_params)
          connection.execute(sqlstring, where_params, function (err, result) {
            callback(err);
          })
        })
      })
      sizeInput.forEach((s, i) => {
        tasks.push(function (callback) {
          var sqlstring = _sql.insertxj_cc;
          var where_params = [
            param.today,
            param.orderno,
            param.ordertype,
            param.dh,
            param.xh,
            param.user == 'tiptop' ? 1 : 2,
            param.user,
            param.starttime,
            param.endtime,
            i + 1,
            s.c ? parseFloat(s.c) : 0,
            s.k ? parseFloat(s.k) : 0,
            s.g ? parseFloat(s.g) : 0,
            param.xjtimes + 1,
          ];
          console.log(sqlstring, where_params)
          connection.execute(sqlstring, where_params, function (err, result) {
            callback(err);
          })
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
  getusers: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao getusers');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getusers;
      console.log(sqlstring);
      var where_params = [];
      connection.execute(sqlstring, where_params, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
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
      var where_params = [param.today, param.orderno, param.dh, param.xh, param.user];
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
      var tasks = [];
      tasks.push(function (callback) {
        var sqlstring = _sql.updatezssc;
        var lj = param.zssc;
        var where_params = [lj.TC_AFL04, lj.TC_AFL05, lj.TC_AFL06, param.today, param.orderno, param.dh, param.xh, param.user];
        console.log(sqlstring, where_params)
        connection.execute(sqlstring, where_params, function (err, result) {
          callback(err);
        })
      })

      if (!!param.checkeduser) {
        var sqlstring = _sql.updateusers;
        var checkeduser = param.checkeduser;
        for (let i = 0; i < checkeduser.length; i++) {
          let user = checkeduser[i];
          tasks.push(function (callback) {
            var where_params = [param.today, param.orderno, param.dh, param.xh, user];
            console.log(sqlstring, where_params)
            connection.execute(sqlstring, where_params, function (err, result) {
              callback(err);
            })
          })
        }
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
      var bgsj_blyy2 = [];
      var bgsj_bllj = [];
      var bgsj_blph = [];
      tasks.push(function (callback) {
        var sqlstring = _sql.getbgsj;
        var where_params = [param.today, param.orderno, param.dh, param.xh, param.user];
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
        var where_params = [param.today, param.orderno, param.dh, param.xh, param.user];
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
            console.log('getbghis', dbresult);
            if (dbresult.length > 0) {
              bghis = dbresult[0].ALLHIS || 0;
            }
          }
          callback(err);
        })
      })
      tasks.push(function (callback) {
        var sqlstring = _sql.getbgsj_begintime;
        var where_params = [param.today, param.orderno, param.dh, param.xh, param.user];
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
            console.log('getbgsj_begintime', dbresult);
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
        var sqlstring = _sql.getbgsj_blyy2;
        var where_params = [param.today, param.orderno, param.dh, param.xh]
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
            bgsj_blyy2 = dbresult;
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
          jsonWrite(res, { bgsj, bgsj_lp, bgsj_bl, bgsj_blyy, bgsj_blyy2, bgsj_bllj, bgsj_blph, bghis, begintime }, dbcode.SUCCESS);
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
        var where_params = [param.today, param.orderno, param.ordertype, bgsj_lp.TC_AFM04, param.dw, param.dh, param.xh, param.user == 'tiptop' ? 1 : 2, param.user,
        param.zssc_begin, param.zssc_end, param.begintime, param.endtime, param.zssc_count, bgsj_lp.TC_AFM16 || ''];
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
          var where_params = [param.today, param.orderno, param.ordertype, bl.TC_AFN04, bl.TC_AFN05, parseFloat(bl.TC_AFN06), bl.TC_AFN07, bl.TC_AFN08, bl.TC_AFN09, bl.TC_AFN10, bl.TC_AFN11, param.dh, param.xh, param.user == 'tiptop' ? 1 : 2, param.user,
          param.zssc_begin, param.zssc_end, param.begintime, param.endtime];
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
        var where_params = [param.today, param.orderno, param.dh, param.xh, param.user];
        console.log(sqlstring, where_params)
        connection.execute(sqlstring, where_params, function (err, result) {
          callback(err);
        })
      })

      tasks.push(function (callback) {
        var sqlstring = _sql.restartzssc;
        var where_params = [param.today, param.orderno, param.dh, param.xh, param.user];
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
  getLqlist: function (req, res, next) {
    console.log('infoDao getLqlist');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getlqlist;
      console.log("getLqlist", sqlstring, param.cjbh);
      connection.execute(sqlstring, [param.cjbh], function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  getCjlist: function (req, res, next) {
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
  getBrlist: function (req, res, next) {
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
  addBrinfo: function (req, res, next) {
    console.log('infoDao addBrinfo');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.addbrinfo;
      var nowDate = new Date();
      var paramlist = [param.lqbh, param.lqmc, param.lqxh, parseInt(param.lqsl), nowDate.Format("yyyy-MM-dd"), nowDate.Format("hh:mm:ss"), param.jcgh, param.cjbh]
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
  updateRtinfo: function (req, res, next) {
    console.log('infoDao updateRtinfo');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.updatertinfo;
      var nowDate = new Date();
      var paramlist = [nowDate.Format("yyyyMMdd"), nowDate.Format("hh:mm:ss"), param.rtgh, param.lqbh, param.lqxh, param.jcrq, param.jcsj]
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
  getSblist: function (req, res, next) {
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
  getGdlist: function (req, res, next) {
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
  getBxlist: function (req, res, next) {
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
        var where_params = [param.sbbh, param.sbmc, param.sbwz, param.gzsm, todayDate.Format('yyyy-MM-dd'), todayDate.Format('hh:mm:ss'), param.user,
        param.gdgd, param.gdgy, param.gddh, param.gdxh, param.gdlx];
        console.log(sqlstring, where_params)
        connection.execute(sqlstring, where_params, function (err, result) {
          callback(err);
        })
      })

      tasks.push(function (callback) {
        var sqlstring = _sql.addbxstatus;
        var where_params = [param.sbbh, param.sbmc, todayDate.Format('yyyy-MM-dd'), todayDate.Format('hh:mm:ss'), 'A', 1, todayDate.Format('yyyy-MM-dd'), '', todayDate.Format('yyyy-MM-dd'), ''];
        console.log(sqlstring, where_params)
        connection.execute(sqlstring, where_params, function (err, result) {
          callback(err);
        })
      })

      tasks.push(function (callback) {
        var sqlstring = _sql.addbxstatus;
        var where_params = [param.sbbh, param.sbmc, todayDate.Format('yyyy-MM-dd'), todayDate.Format('hh:mm:ss'), 'B', 0, todayDate.Format('yyyy-MM-dd'), '', todayDate.Format('yyyy-MM-dd'), ''];
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
  getFplist: function (req, res, next) {
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
  updateZpinfo: function (req, res, next) {
    console.log('infoDao updateZpinfo');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.updatezpinfo;
      var paramlist = [param.zpry, param.sbbh, param.bxdate, param.bxtime]
      console.log(sqlstring, paramlist);
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
  updateBxstatus: function (req, res, next) {
    console.log('infoDao updateBxstatus');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {

      var tasks = [];
      var nCount = 0;
      tasks.push(function (callback) {
        var sqlstring = _sql.checkbxstatus;
        var where_params = [param.sbbh, param.bxdate, param.bxtime, param.bxtype, param.bxstatus];
        console.log(sqlstring, where_params)
        connection.execute(sqlstring, where_params, function (err, result) {
          nCount = result.rows[0][0];
          console.log('nCount', nCount);
          if (nCount > 0) {
            callback("count > 0!!");
          } else {
            callback(err);
          }
        })
      })

      tasks.push(function (callback) {
        // var sqlstring = _sql.checkzp;
        // var where_params = [param.sbbh, nowDate.Format("yyyy-MM-dd")];
        // console.log(sqlstring, where_params)
        // connection.execute(sqlstring, where_params, function (err, result) {
        //   callback(err);
        // })
        var sqlstring = "";
        if (param.bxtype == 2) {
          sqlstring = _sql.updatebxstatus_begin;
        } else {
          sqlstring = _sql.updatebxstatus_end;
        }
        var nowDate = new Date();
        var paramlist = [nowDate.Format("yyyy-MM-dd"), nowDate.Format("hh:mm:ss"), param.bxtype, param.sbbh, param.bxdate, param.bxtime, param.bxstatus]
        console.log(sqlstring, paramlist);
        connection.execute(sqlstring, paramlist, function (err, result) {
          callback(err);
        });
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
  updateWxinfo: function (req, res, next) {
    console.log('infoDao updateWxinfo');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.updatewxinfo;
      var paramlist = [param.wxnr, param.sbbh, param.bxdate, param.bxtime]
      console.log(sqlstring, paramlist);
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

  getsjcount: function (req, res, next) {
    console.log('infoDao getsjcount');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getsjcount;
      var paramlist = [param.today];
      if (!!param.useraccount) {
        sqlstring += " AND tc_ttr18=:useraccount";
        paramlist.push(param.useraccount);
      }
      connection.execute(sqlstring, paramlist, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  getsjlist: function (req, res, next) {
    console.log('infoDao getsjlist');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getsjlist;
      var paramlist = [param.today];
      if (!!param.useraccount) {
        sqlstring += " AND tc_ttr18=:useraccount";
        paramlist.push(param.useraccount);
      }
      connection.execute(sqlstring, paramlist, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  getjylist: function (req, res, next) {
    console.log('infoDao getjylist');
    var param = req.body.data;
    var context = this;
    // _dao.getConnection(res, function (connection) {
    //   var sqlstring = _sql.getjylist;
    //   var paramlist = [param.rwbh];
    //   connection.execute(sqlstring, paramlist, function (err, result) {
    //     context.listresult(res, err, result);
    //     connection.release();
    //   });
    // });

    _dao.getConnection(res, function (connection) {
      var tasks = [];
      var wlqr = [];
      var sbcs = [];
      var cpqr = [];
      tasks.push(function (callback) {
        var sqlstring = _sql.getjylist_wlqr;
        var paramlist = [param.rwbh];
        connection.execute(sqlstring, paramlist, function (err, result) {
          wlqr = context.getlistResult(result);
          callback(err);
        });
      })
      tasks.push(function (callback) {
        var sqlstring = _sql.getjylist_sbcs;
        var paramlist = [param.rwbh];
        connection.execute(sqlstring, paramlist, function (err, result) {
          sbcs = context.getlistResult(result);
          callback(err);
        });
      })
      tasks.push(function (callback) {
        var sqlstring = _sql.getjylist_cpqr;
        var paramlist = [param.rwbh];

        console.log(sqlstring, paramlist)
        connection.execute(sqlstring, paramlist, function (err, result) {
          cpqr = context.getlistResult(result);
          callback(err);
        });
      })

      async.series(tasks, function (err, results) {
        if (err) {
          console.log('tasks error', err);
          connection.rollback(); // 发生错误事务回滚
          jsonWrite(res, {}, dbcode.FAIL);
        } else {
          jsonWrite(res, { wlqr, sbcs, cpqr }, dbcode.SUCCESS);
        }
        connection.release();
      });
    });
  },
  getjymx: function (req, res, next) {
    console.log('infoDao getjymx');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getjymx;
      var paramlist = [param.rwbh, param.xh];
      console.log(sqlstring, paramlist)
      connection.execute(sqlstring, paramlist, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  getjymx_wlqr: function (req, res, next) {
    console.log('infoDao getjymx_wlqr');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getjymx_wlqr;
      var paramlist = [param.rwbh, param.ljbh];
      console.log(sqlstring, paramlist)
      connection.execute(sqlstring, paramlist, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  getjymx_cpqrn: function (req, res, next) {
    console.log('infoDao getjymx_cpqrn');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getjymx_cpqrn;
      var paramlist = [param.rwbh, param.ljbh];
      console.log(sqlstring, paramlist)
      connection.execute(sqlstring, paramlist, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  getjymx_cpqry: function (req, res, next) {
    console.log('infoDao getjymx_cpqry');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var tasks = [];
      var jymx = [];
      var jyxc = [];
      tasks.push(function (callback) {
        var sqlstring = _sql.getjymx_cpqry;
        var paramlist = [param.rwbh, param.ljbh];
        connection.execute(sqlstring, paramlist, function (err, result) {
          jymx = context.getlistResult(result);
          callback(err);
        });
      })
      tasks.push(function (callback) {
        var sqlstring = _sql.getjymx_cpqry_xc;
        var paramlist = [param.rwbh, param.ljbh];
        connection.execute(sqlstring, paramlist, function (err, result) {
          jyxc = context.getlistResult(result);
          callback(err);
        });
      })

      async.series(tasks, function (err, results) {
        if (err) {
          console.log('tasks error', err);
          connection.rollback(); // 发生错误事务回滚
          jsonWrite(res, {}, dbcode.FAIL);
        } else {
          jsonWrite(res, { jymx, jyxc }, dbcode.SUCCESS);
        }
        connection.release();
      });
    });
  },
  getcsbz: function (req, res, next) {
    console.log('infoDao getcsbz');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getcsbz;
      var paramlist = [param.xlh, param.xmbh];
      console.log(sqlstring, paramlist)
      connection.execute(sqlstring, paramlist, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },

  getcslist: function (req, res, next) {
    console.log('infoDao getcslist');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getcslist;
      var paramlist = [param.rwbh, param.xc];
      console.log(sqlstring, paramlist)
      connection.execute(sqlstring, paramlist, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  getcslist_cpqry: function (req, res, next) {
    console.log('infoDao getcslist_cpqry');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getcslist_cpqry;
      var paramlist = [param.rwbh];
      console.log(sqlstring, paramlist)
      connection.execute(sqlstring, paramlist, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },

  updatesjcs: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao updatesjcs', req.body.data);
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var tasks = [];

      for (let i = 0; i < param.cylist.length; i++) {
        tasks.push(function (callback) {
          var sqlstring = _sql.updatecs;
          var where_params = [param.rwbh, param.xh, i + 1, param.cylist[i], param.sfcl];
          console.log(sqlstring, where_params)
          connection.execute(sqlstring, where_params, function (err, result) {
            callback(err);
          })
        })
      }

      tasks.push(function (callback) {
        var sqlstring = _sql.updatecsresult;
        var where_params = [param.useraccount, new Date().Format('hh:mm:ss'), param.rwbh, param.xh];
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
  updatesjcs_cpqrn: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao updatesjcs_cpqrn', req.body.data);
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var tasks = [];

      for (let i = 0; i < param.cylist.length; i++) {
        tasks.push(function (callback) {
          var sqlstring = _sql.updatecs;
          var where_params = [param.rwbh, param.xh, i + 1, param.cylist[i], param.sfcl];
          console.log(sqlstring, where_params)
          connection.execute(sqlstring, where_params, function (err, result) {
            callback(err);
          })
        })
      }

      tasks.push(function (callback) {
        var sqlstring = _sql.updatecsresult_cpqr;
        sqlstring += ` AND ${param.key}=:xc`;
        // and tc_tts23=:xc
        var where_params = [param.useraccount, new Date().Format('hh:mm:ss'), param.rwbh, param.xh];
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
  updatesjcs_cpqry: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao updatesjcs', req.body.data);
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var tasks = [];

      for (let i = 0; i < param.cylist.length; i++) {
        for (let xc in param.cylist[i]) {
          tasks.push(function (callback) {
            var sqlstring = _sql.updatecs;
            var where_params = [param.rwbh, xc, i + 1, param.cylist[i][xc], param.sfcl];
            console.log(sqlstring, where_params)
            connection.execute(sqlstring, where_params, function (err, result) {
              callback(err);
            })
          })
        }
      }

      tasks.push(function (callback) {
        var sqlstring = _sql.updatecsresult_cpqr;
        sqlstring += ` AND ${param.key}=:xc`;
        var where_params = [param.useraccount, new Date().Format('hh:mm:ss'), param.rwbh, param.xh];
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
  updatejymx: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao updatejymx', req.body.data);
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var tasks = [];

      tasks.push(function (callback) {
        var sqlstring = _sql.updatejymx;
        var where_params = [param.cyresult, param.rwbh, param.xh];
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
  updatesjjy: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao updatesjjy', req.body.data);
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var tasks = [];

      tasks.push(function (callback) {
        var sqlstring = `update tc_ttr_file set tc_ttr16=:begintime, tc_ttr17=:endtime,tc_ttr20='Y'
        where tc_ttr26=:rwbh`;
        var where_params = [
          new Date().Format('hh:mm:ss'),
          param.rwbh,
        ];
        if (!!param.hasbegintime) {
          where_params.unshift(param.begintime);
        }
        console.log(sqlstring, where_params)
        connection.execute(sqlstring, where_params, function (err, result) {
          callback(err);
        })
      })

      if (!param.xj) {
        tasks.push(function (callback) {
          var sqlstring = _sql.updatesjstatus;
          var where_params = [
            param.rwbh,
          ];
          console.log(sqlstring, where_params)
          connection.execute(sqlstring, where_params, function (err, result) {
            callback(err);
          })
        })
        tasks.push(function (callback) {
          var sqlstring = _sql.updatesjqr_nn;
          var where_params = [
            param.begintime,
            new Date().Format("hh:mm:ss"),
            param.rwbh,
          ];
          console.log(sqlstring, where_params)
          connection.execute(sqlstring, where_params, function (err, result) {
            callback(err);
          })
        })
      }




      // if (param.jyresult == 'X') {
      //   for (let i = 0; i < param.nglist.length; i++) {
      //     tasks.push(function (callback) {
      //       var sqlstring = _sql.insertjyjl_x;
      //       var where_params = [
      //         param.rwbh,
      //         new Date(param.begintime).Format("yyyy-MM-dd"),
      //         new Date(param.begintime).Format("hh:mm:ss"),
      //         new Date().Format("hh:mm:ss"),
      //         param.nglist[i].bz,
      //         param.cysl,
      //         param.curdw
      //       ];
      //       console.log(sqlstring, where_params)
      //       connection.execute(sqlstring, where_params, function (err, result) {
      //         callback(err);
      //       })
      //     })
      //   }
      //   tasks.push(function (callback) {
      //     var sqlstring = _sql.updatesjstatus;
      //     var where_params = [
      //       param.jyresult,
      //       param.rwbh,
      //     ];
      //     console.log(sqlstring, where_params)
      //     connection.execute(sqlstring, where_params, function (err, result) {
      //       callback(err);
      //     })
      //   })
      // } else {
      //   for (let i = 0; i < 1; i++) {
      //     tasks.push(function (callback) {
      //       var sqlstring = _sql.insertjyjl_y;
      //       var where_params = [
      //         param.rwbh,
      //         new Date(param.begintime).Format("yyyy-MM-dd"),
      //         new Date(param.begintime).Format("hh:mm:ss"),
      //         new Date().Format("hh:mm:ss"),
      //       ];
      //       console.log(sqlstring, where_params)
      //       connection.execute(sqlstring, where_params, function (err, result) {
      //         callback(err);
      //       })
      //     })
      //   }
      //   tasks.push(function (callback) {
      //     var sqlstring = _sql.updatesjstatus;
      //     var where_params = [
      //       param.jyresult,
      //       param.rwbh,
      //     ];
      //     console.log(sqlstring, where_params)
      //     connection.execute(sqlstring, where_params, function (err, result) {
      //       callback(err);
      //     })
      //   })

      //   tasks.push(function (callback) {
      //     var sqlstring = _sql.updatesjqr_nn;
      //     var where_params = [
      //       new Date(param.begintime).Format("hh:mm:ss"),
      //       new Date().Format("hh:mm:ss"),
      //       param.rwbh,
      //     ];
      //     console.log(sqlstring, where_params)
      //     connection.execute(sqlstring, where_params, function (err, result) {
      //       callback(err);
      //     })
      //   })

      //   // 生成巡检表
      //   var xjcount = 0;
      //   var xjduration = [];
      //   var xjbegin = moment();
      //   var xjend = moment();
      //   // 获取巡检次数
      //   tasks.push(function (callback) {
      //     var sqlstring = _sql.getxjcount_n;
      //     var where_params = [
      //       param.rwbh,
      //     ];
      //     console.log(sqlstring, where_params)
      //     connection.execute(sqlstring, where_params, function (err, result) {
      //       if (!err) {
      //         xjcount = result.rows[0][0];
      //       }
      //       callback(err);
      //     })
      //   })
      //   // 获取巡检时间
      //   tasks.push(function (callback) {
      //     var sqlstring = _sql.getxjduration;
      //     var where_params = [
      //       param.rwbh,
      //     ];
      //     console.log(sqlstring, where_params)
      //     connection.execute(sqlstring, where_params, function (err, result) {
      //       if (!err) {
      //         xjduration = result.rows;
      //       }
      //       callback(err);
      //     })
      //   })

      //   tasks.push(function (callback) {
      //     for (let i = 0; i < xjcount; i++) {
      //       var duration = 0;
      //       var durationCell = xjduration.find(x => x[0] == i + 1);
      //       if (!!durationCell) {
      //         duration = durationCell[1];
      //       }
      //       var sqlstring = _sql.updatexjjl;
      //       xjend = xjbegin.add(duration, 'm');
      //       var where_params = [
      //         xjbegin.format("HH:mm:ss"),
      //         xjend.format("HH:mm:ss"),
      //         param.rwbh,
      //         i + 1,
      //       ];
      //       console.log(sqlstring, where_params)
      //       connection.execute(sqlstring, where_params, function (err, result) {
      //         callback(err);
      //       })
      //       xjbegin = xjend;
      //     }
      //   });


      // }

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
  updatesjbegintime: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao updatesjbegintime', req.body.data);
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var tasks = [];
      tasks.push(function (callback) {
        var sqlstring = _sql.updatesjbegintime;
        var where_params = [
          param.begintime,
          param.rwbh,
        ];
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
  updatesjmxBeginTime: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao updatesjmxBeginTime', req.body.data);
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var tasks = [];
      var hasbegintime = false;
      tasks.push(function (callback) {
        var sqlstring = _sql.getsjmxbegintime;
        sqlstring += ` AND ${param.key}=:xc`;
        var where_params = [
          param.rwbh,
          param.xc
        ];
        console.log(sqlstring, where_params)
        connection.execute(sqlstring, where_params, function (err, result) {
          if (!!result.rows[0][0]) {
            hasbegintime = true;
          }
          callback(err);
        })
      })
      tasks.push(function (callback) {
        if (hasbegintime) {
          return;
        }
        var sqlstring = _sql.updatesjmxbegintime;
        sqlstring += ` AND ${param.key}=:xc`;
        var where_params = [
          new Date().Format('hh:mm:ss'),
          param.rwbh,
          param.xc
        ];
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




  getxjcount_nnn: function (req, res, next) {
    console.log('infoDao getxjcount_nnn');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getxjcount_nnn;
      var paramlist = [param.today, new Date().Format('hh:mm:ss')];
      if (!!param.useraccount) {
        sqlstring += " AND tc_ttr18=:useraccount";
        paramlist.push(param.useraccount);
      }
      console.log(sqlstring, paramlist);
      connection.execute(sqlstring, paramlist, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  getxjlist: function (req, res, next) {
    console.log('infoDao getxjlist');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getxjlist;
      var paramlist = [param.today, new Date().Format('hh:mm:ss')];
      if (!!param.useraccount) {
        sqlstring += " AND tc_ttr18=:useraccount";
        paramlist.push(param.useraccount);
      }
      //sqlstring += " order by tc_bai01,tc_bai02";
      connection.execute(sqlstring, paramlist, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },

  getcpjcount: function (req, res, next) {
    console.log('infoDao getcpjcount');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getcpjcount;
      var paramlist = [];
      // var paramlist = [param.today, new Date().Format('hh:mm:ss')];
      // if (!!param.useraccount) {
      //   sqlstring += " AND tc_ttr18=:useraccount";
      //   paramlist.push(param.useraccount);
      // }
      console.log(sqlstring, paramlist);
      connection.execute(sqlstring, paramlist, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  getcpjlist: function (req, res, next) {
    console.log('infoDao getcpjlist');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getcpjlist;
      var paramlist = [];
      // var paramlist = [param.today,new Date().Format('hh:mm:ss')];
      // if (!!param.useraccount) {
      //   sqlstring += " AND tc_ttr18=:useraccount";
      //   paramlist.push(param.useraccount);
      // }
      //sqlstring += " order by tc_bai01,tc_bai02";
      connection.execute(sqlstring, paramlist, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  getcpjjylist: function (req, res, next) {
    console.log('infoDao getcpjjylist');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getcpjjylist;
      var paramlist = [param.rwbh];
      console.log(sqlstring, paramlist);
      connection.execute(sqlstring, paramlist, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  updatecpjjy: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao updatecpjjy', req.body.data);
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var tasks = [];

      tasks.push(function (callback) {
        var sqlstring = _sql.updatecpjjy;
        var where_params = [
          param.rwbh,
        ];
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
  getcpjjymx_y: function (req, res, next) {
    console.log('infoDao getcpjjymx_y');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getcpjjymx_y;
      var paramlist = [param.rwbh,param.ljbh];
      console.log(sqlstring, paramlist);
      connection.execute(sqlstring, paramlist, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },
  updatecpjcs_y: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao updatecpjcs_y', req.body.data);
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var tasks = [];

      for (let i = 0; i < param.cylist.length; i++) {
        for (let xc in param.cylist[i]) {
          tasks.push(function (callback) {
            var sqlstring = _sql.updatecs;
            var where_params = [param.rwbh, xc, i + 1, param.cylist[i][xc], param.sfcl];
            console.log(sqlstring, where_params)
            connection.execute(sqlstring, where_params, function (err, result) {
              callback(err);
            })
          })
        }
      }

      tasks.push(function (callback) {
        var sqlstring = _sql.updatecpjresult;
        sqlstring += ` AND ${param.key}=:xc`;
        var where_params = [param.useraccount, new Date().Format('yyyy-MM-dd'), new Date().Format('hh:mm:ss'), param.rwbh, param.xh];
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
  updatecpjcs_n: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao updatecpjcs_N', req.body.data);
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var tasks = [];

      for (let i = 0; i < param.cylist.length; i++) {
        tasks.push(function (callback) {
          var sqlstring = _sql.updatecs;
          var where_params = [param.rwbh, param.xh, i + 1, param.cylist[i], param.sfcl];
          console.log(sqlstring, where_params)
          connection.execute(sqlstring, where_params, function (err, result) {
            callback(err);
          })
        })
      }

      tasks.push(function (callback) {
        var sqlstring = _sql.updatecpjresult;
        sqlstring += ` AND ${param.key}=:xc`;
        var where_params = [param.useraccount, new Date().Format('yyyy-MM-dd'), new Date().Format('hh:mm:ss'), param.rwbh, param.xh];
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
  updatecpjmxBeginTime: function (req, res, next) {
    //var pool = _dao.getPool();
    console.log('infoDao updatecpjmxBeginTime', req.body.data);
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var tasks = [];
      var hasbegintime = false;
      tasks.push(function (callback) {
        var sqlstring = _sql.getcpjmxbegintime;
        sqlstring += ` AND ${param.key}=:xc`;
        var where_params = [
          param.rwbh,
          param.xc
        ];
        console.log(sqlstring, where_params)
        connection.execute(sqlstring, where_params, function (err, result) {
          if (!!result.rows[0][0]) {
            hasbegintime = true;
          }
          callback(err);
        })
      })
      tasks.push(function (callback) {
        if (hasbegintime) {
          return;
        }
        var sqlstring = _sql.updatecpjmxbegintime;
        sqlstring += ` AND ${param.key}=:xc`;
        var where_params = [
          new Date().Format('yyyy-MM-dd'),
          new Date().Format('hh:mm:ss'),
          param.rwbh,
          param.xc
        ];
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
  getcpjjymx_n: function (req, res, next) {
    console.log('infoDao getcpjjymx_n');
    var param = req.body.data;
    var context = this;
    _dao.getConnection(res, function (connection) {
      var sqlstring = _sql.getcpjjymx_n;
      var paramlist = [param.rwbh,param.ljbh];
      console.log(sqlstring, paramlist);
      connection.execute(sqlstring, paramlist, function (err, result) {
        context.listresult(res, err, result);
        connection.release();
      });
    });
  },

};
