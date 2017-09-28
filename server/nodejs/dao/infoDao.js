
var _dao = require('./dao');
var _sql = require('./sqlMapping');

var jsonWrite = _dao.jsonWrite;
var dbcode = _dao.dbcode;

module.exports = {
  getOrder: function (req, res, next) {
    var pool = _dao.getPool();
    console.log('infoDao getOrder');
    var param = req.body.data;
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
          connection.release();
        });
      }
    });
  },
  getOrderDetail: function (req, res, next) {
    var pool = _dao.getPool();
    console.log('infoDao getOrderDetail');
    var param = req.body.data;
    pool.getConnection(function (err, connection) {
      if (connection == undefined) {
        jsonWrite(res, {}, dbcode.CONNECT_ERROR);
        return;
      } else {
        var sqlstring = _sql.getorderdetail;
        var where_params = [param.order];
        connection.execute(sqlstring, where_params, function (err, result) {
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
          connection.release();
        });
      }
    });
  },
};
