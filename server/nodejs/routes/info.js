var express = require('express');
var router = express.Router();

var infoDao = require('../dao/infoDao');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function (req, res, next) {
  console.log('info :' + JSON.stringify(req.body));
  if (req.body.cmd == "getorder") {
    console.log('getorder');
    infoDao.getOrder(req, res, next);
  } else if (req.body.cmd == "getorderdetail") {
    console.log('getorderdetail');
    infoDao.getOrderDetail(req, res, next);
  }

  else if (req.body.cmd == "gettodaytask") {
    console.log('gettodaytask');
    infoDao.getTodayTask(req, res, next);
  } else if (req.body.cmd == "gettaskstate") {
    console.log('gettaskstate');
    infoDao.getTaskState(req, res, next);
  } else if (req.body.cmd == "updatetaskstate"){
    console.log('updatetaskstate');
    infoDao.updateTaskState(req, res, next);
  } else if (req.body.cmd == "gettaskinfo"){
    console.log('gettaskinfo');
    infoDao.getTaskInfo(req, res, next);
  } else if (req.body.cmd == "getwlqd"){
    console.log('getwlqd');
    infoDao.getWlqd(req, res, next);
  } else if (req.body.cmd == "updatewlqd"){
    console.log('updatewlqd');
    infoDao.updateWlqd(req, res, next);
  }
});


module.exports = router;
