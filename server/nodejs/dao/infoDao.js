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
    var pool = _dao.getPool();
    console.log('infoDao getOrder');
    var param = req.body.data;
    var context = this;
    pool.getConnection(function (err, connection) {
      if (connection == undefined) {
        jsonWrite(res, {}, dbcode.CONNECT_ERROR);
        return;
      } else {
        var sqlstring = _sql.getorder;
        var where_params = [];
        if (param.orderno) {
          sqlstring += "WHERE TC_AFR02=:orderno"
          where_params = [param.orderno]
        } else {
          sqlstring += "WHERE to_char(sfb81,'YYYY-MM-DD') >= :begindate AND to_char(sfb81,'YYYY-MM-DD') <= :enddate"
          where_params = [param.beginDate, param.endDate]
        }
        connection.execute(sqlstring, where_params, function (err, result) {
          context.listresult(res, err, result);
          connection.release();
        });
      }
    });
  },
  getOrderDetail: function (req, res, next) {
    var pool = _dao.getPool();
    console.log('infoDao getOrderDetail');
    var param = req.body.data;
    var context = this;
    pool.getConnection(function (err, connection) {
      if (connection == undefined) {
        jsonWrite(res, {}, dbcode.CONNECT_ERROR);
        return;
      } else {
        var sqlstring = _sql.getorderdetail;
        var where_params = [param.order];
        connection.execute(sqlstring, where_params, function (err, result) {
          context.listresult(res, err, result);
          connection.release();
        });
      }
    });
  },
  getTodayTask: function (req, res, next) {
    var pool = _dao.getPool();
    console.log('infoDao getTodayTask');
    var param = req.body.data;
    var context = this;
    pool.getConnection(function (err, connection) {

      console.log('infoDao getTodayTask1');
      if (connection == undefined) {
        jsonWrite(res, {}, dbcode.CONNECT_ERROR);
        return;
      } else {
        var sqlstring = _sql.gettodaytask;
        var where_params = [param.today];
        connection.execute(sqlstring, where_params, function (err, result) {

          console.log('infoDao getTodayTask2');
          context.listresult(res, err, result);

          console.log('infoDao getTodayTask3');
          connection.release();
        });
      }
    });
  },
  getTaskState: function (req, res, next) {
    var pool = _dao.getPool();
    console.log('infoDao getTaskState');
    var param = req.body.data;
    var context = this;
    pool.getConnection(function (err, connection) {
      if (connection == undefined) {
        jsonWrite(res, {}, dbcode.CONNECT_ERROR);
        return;
      } else {
        var sqlstring = _sql.gettaskstate;
        var where_params = [param.today];
        connection.execute(sqlstring, where_params, function (err, result) {
          context.listresult(res, err, result);
          connection.release();
        });
      }
    });
  },
  updateTaskState: function (req, res, next) {
    var pool = _dao.getPool();
    console.log('infoDao updateTaskState');
    var param = req.body.data;
    var context = this;
    pool.getConnection(function (err, connection) {
      if (connection == undefined) {
        jsonWrite(res, {}, dbcode.CONNECT_ERROR);
        return;
      } else {
        var sqlstring;
        if (param.type == "begintask") {
          sqlstring = _sql.begintask;
        } else {
          sqlstring = _sql.endtask;
        }
        var where_params = [param.time, param.today, param.orderno, param.ordertype, param.step];
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
      }
    });
  },
  getTaskInfo: function (req, res, next) {
    var pool = _dao.getPool();
    console.log('infoDao getTaskInfo');
    var param = req.body.data;
    var context = this;
    pool.getConnection(function (err, connection) {
      if (connection == undefined) {
        jsonWrite(res, {}, dbcode.CONNECT_ERROR);
        return;
      } else {
        var sqlstring = _sql.gettaskinfo;
        var where_params = [param.orderno, param.today, param.ordertype];
        connection.execute(sqlstring, where_params, function (err, result) {
          context.listresult(res, err, result);
          connection.release();
        });
      }
    });
  },
  getWlqd: function (req, res, next) {
    var pool = _dao.getPool();
    console.log('infoDao getWlqd');
    var param = req.body.data;
    var context = this;
    pool.getConnection(function (err, connection) {
      if (connection == undefined) {
        jsonWrite(res, {}, dbcode.CONNECT_ERROR);
        return;
      } else {
        var sqlstring = _sql.getwlqd;
        var where_params = [param.today, param.orderno, param.ordertype];
        connection.execute(sqlstring, where_params, function (err, result) {
          context.listresult(res, err, result);
          connection.release();
        });
      }
    });
  },
  updateWlqd: function (req, res, next) {
    var pool = _dao.getPool();
    console.log('infoDao updateWlqd', req.body.data);
    var param = req.body.data;
    var context = this;
    pool.getConnection(function (err, connection) {
      if (connection == undefined) {
        jsonWrite(res, {}, dbcode.CONNECT_ERROR);
        return;
      } else {
        var sqlstring = _sql.updatewlqd;
        var tasks = [];
        for (let i = 0; i < param.wlqd.length; i++) {
          let lj = param.wlqd[i];
          tasks.push(function (callback) {
            var where_params = [lj.TC_AFI09 || "", lj.TC_AFI10 || "", lj.TC_AFI11 || "", lj.TC_AFI12 || "", param.today, param.orderno, param.ordertype, lj.TC_AFI04];
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
      }
    });
  },
  getSbtj: function (req, res, next) {
    var pool = _dao.getPool();
    console.log('infoDao getSbtj');
    var param = req.body.data;
    var context = this;
    pool.getConnection(function (err, connection) {
      if (connection == undefined) {
        jsonWrite(res, {}, dbcode.CONNECT_ERROR);
        return;
      } else {
        var sqlstring = _sql.getsbtj;
        var where_params = [param.today, param.orderno, param.ordertype];
        connection.execute(sqlstring, where_params, function (err, result) {
          context.listresult(res, err, result);
          connection.release();
        });
      }
    });
  },
  updateSbtj: function (req, res, next) {
    var pool = _dao.getPool();
    console.log('infoDao updateSbtj', req.body.data);
    var param = req.body.data;
    var context = this;
    pool.getConnection(function (err, connection) {
      if (connection == undefined) {
        jsonWrite(res, {}, dbcode.CONNECT_ERROR);
        return;
      } else {
        var sqlstring = _sql.updatesbtj;
        var tasks = [];
        for (let i = 0; i < param.sbtj.length; i++) {
          let lj = param.sbtj[i];
          tasks.push(function (callback) {
            var where_params = [param.today, param.orderno, param.ordertype, lj.TC_AFJ04, lj.TC_AFJ05, lj.TC_AFJ06, lj.TC_AFJ07, lj.TC_AFJ08];
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
      }
    });
  },
  getSjqr: function (req, res, next) {
    var pool = _dao.getPool();
    console.log('infoDao getSjqr');
    var param = req.body.data;
    var context = this;
    pool.getConnection(function (err, connection) {
      if (connection == undefined) {
        jsonWrite(res, {}, dbcode.CONNECT_ERROR);
        return;
      } else {
        var sqlstring = _sql.getsjqr;
        var where_params = [param.today, param.orderno, param.ordertype];
        connection.execute(sqlstring, where_params, function (err, result) {
          context.listresult(res, err, result);
          connection.release();
        });
      }
    });
  },
  updateSjqr: function (req, res, next) {
    var pool = _dao.getPool();
    console.log('infoDao updateSjqr', req.body.data);
    var param = req.body.data;
    var context = this;
    pool.getConnection(function (err, connection) {
      if (connection == undefined) {
        jsonWrite(res, {}, dbcode.CONNECT_ERROR);
        return;
      } else {
        var sqlstring = _sql.updatesjqr;
        var lj = param.sjqr;
        var where_params = [lj.TC_AFK04 ,lj.TC_AFK05 || "", lj.TC_AFK06 ,lj.TC_AFK07 || "", lj.TC_AFK08 ,lj.TC_AFK09 || "", lj.TC_AFK10 ,lj.TC_AFK11 || "", param.today, param.orderno, param.ordertype];
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
      }
    });
  },
  getZssc: function (req, res, next) {
    var pool = _dao.getPool();
    console.log('infoDao getZssc');
    var param = req.body.data;
    var context = this;
    pool.getConnection(function (err, connection) {
      if (connection == undefined) {
        jsonWrite(res, {}, dbcode.CONNECT_ERROR);
        return;
      } else {
        var sqlstring = _sql.getzssc;
        var where_params = [param.today, param.orderno, param.ordertype];
        connection.execute(sqlstring, where_params, function (err, result) {
          context.listresult(res, err, result);
          connection.release();
        });
      }
    });
  },
  updateZssc: function (req, res, next) {
    var pool = _dao.getPool();
    console.log('infoDao updateZssc', req.body.data);
    var param = req.body.data;
    var context = this;
    pool.getConnection(function (err, connection) {
      if (connection == undefined) {
        jsonWrite(res, {}, dbcode.CONNECT_ERROR);
        return;
      } else {
        var sqlstring = _sql.updatezssc;
        var lj = param.zssc;
        var where_params = [lj.TC_AFL04 ,lj.TC_AFL05,lj.TC_AFL06, param.today, param.orderno, param.ordertype];
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
      }
    });
  },
};
