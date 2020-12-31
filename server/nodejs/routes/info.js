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
  } else if (req.body.cmd == "restartserve") {
    console.log('restartserve');
    process.exit();
  }

  else if (req.body.cmd == "login") {
    console.log('login');
    infoDao.login(req, res, next);
  } else if (req.body.cmd == "gettodaytask") {
    console.log('gettodaytask');
    infoDao.getTodayTask(req, res, next);
  } else if (req.body.cmd == "getabmlist") {
    console.log('getabmlist');
    infoDao.getAbmList(req, res, next);
  } else if (req.body.cmd == "gettaskstate") {
    console.log('gettaskstate');
    infoDao.getTaskState(req, res, next);
  } else if (req.body.cmd == "updatetaskstate") {
    console.log('updatetaskstate');
    infoDao.updateTaskState(req, res, next);
  } else if (req.body.cmd == "gettaskinfo") {
    console.log('gettaskinfo');
    infoDao.getTaskInfo(req, res, next);
  } else if (req.body.cmd == "getwlqd") {
    console.log('getwlqd');
    infoDao.getWlqd(req, res, next);
  } else if (req.body.cmd == "updatewlqd") {
    console.log('updatewlqd');
    infoDao.updateWlqd(req, res, next);
  } else if (req.body.cmd == "getsbtj") {
    console.log('getsbtj');
    infoDao.getSbtj(req, res, next);
  } else if (req.body.cmd == "updatesbtj") {
    console.log('updatesbtj');
    infoDao.updateSbtj(req, res, next);
  } else if (req.body.cmd == "getsbtj_n") {
    console.log('getsbtj_n');
    infoDao.getSbtj_n(req, res, next);
  } else if (req.body.cmd == "updatesbtj_n") {
    console.log('updatesbtj_n');
    infoDao.updateSbtj_n(req, res, next);
  } else if (req.body.cmd == "getsjqr") {
    console.log('getsjqr');
    infoDao.getSjqr(req, res, next);
  } else if (req.body.cmd == "updatesjqr") {
    console.log('updatesjqr');
    infoDao.updateSjqr(req, res, next);
  } else if (req.body.cmd == "getsjqr_n") {
    console.log('getsjqr_n');
    infoDao.getSjqr_n(req, res, next);
  } else if (req.body.cmd == "updatesjqr_n") {
    console.log('updatesjqr_n');
    infoDao.updateSjqr_n(req, res, next);
  } else if (req.body.cmd == "getzssc") {
    console.log('getzssc');
    infoDao.getZssc(req, res, next);
  } else if (req.body.cmd == "getusers") {
    console.log('getusers');
    infoDao.getusers(req, res, next);
  } else if (req.body.cmd == "updatezssc") {
    console.log('updatezssc');
    infoDao.updateZssc(req, res, next);
  } else if (req.body.cmd == "getbgsj") {
    console.log('getbgsj');
    infoDao.getBgsj(req, res, next);
  } else if (req.body.cmd == "updatebgsj") {
    console.log('updatebgsj');
    infoDao.updateBgsj(req, res, next);
  } else if (req.body.cmd == "continuetaskstate") {
    console.log('continuetaskstate');
    infoDao.continueTaskState(req, res, next);
  } else if (req.body.cmd == "getsbtj_lp") {
    console.log('getsbtj_lp');
    infoDao.getSbtj_lp(req, res, next);
  } else if (req.body.cmd == "updatebgsj_lp") {
    console.log('updatebgsj_lp');
    infoDao.updateBgsj_lp(req, res, next);
  } else if (req.body.cmd == "getbgsj_bl") {
    console.log('getbgsj_bl');
    infoDao.getBgsj_bl(req, res, next);
  } else if (req.body.cmd == "updatebgsj_bl") {
    console.log('updatebgsj_bl');
    infoDao.updateBgsj_bl(req, res, next);
  } else if (req.body.cmd == "getlqlist") {
    console.log('getlqlist');
    infoDao.getLqlist(req, res, next);
  } else if (req.body.cmd == "getcjlist") {
    console.log('getcjlist');
    infoDao.getCjlist(req, res, next);
  } else if (req.body.cmd == "getbrlist") {
    console.log('getbrlist');
    infoDao.getBrlist(req, res, next);
  } else if (req.body.cmd == "addbrinfo") {
    console.log('addbrinfo');
    infoDao.addBrinfo(req, res, next);
  } else if (req.body.cmd == "updatertinfo") {
    console.log('updatertinfo');
    infoDao.updateRtinfo(req, res, next);
  } else if (req.body.cmd == "getbxlist") {
    console.log('getbxlist');
    infoDao.getBxlist(req, res, next);
  } else if (req.body.cmd == "getsblist") {
    console.log('getsblist');
    infoDao.getSblist(req, res, next);
  } else if (req.body.cmd == "getgdlist") {
    console.log('getgdlist');
    infoDao.getGdlist(req, res, next);
  } else if (req.body.cmd == "addbxinfo") {
    console.log('addbxinfo');
    infoDao.addBxinfo(req, res, next);
  } else if (req.body.cmd == "getfplist") {
    console.log('getfplist');
    infoDao.getFplist(req, res, next);
  } else if (req.body.cmd == "updatezpinfo") {
    console.log('updatezpinfo');
    infoDao.updateZpinfo(req, res, next);
  } else if (req.body.cmd == "updatebxstatus") {
    console.log('updatebxstatus');
    infoDao.updateBxstatus(req, res, next);
  } else if (req.body.cmd == "updatewxinfo") {
    console.log('updatewxinfo');
    infoDao.updateWxinfo(req, res, next);
  } else if (req.body.cmd == "getxj") {
    console.log('getxj');
    infoDao.getXj(req, res, next);
  } else if (req.body.cmd == "updatexj") {
    console.log('updatexj');
    infoDao.updateXj(req, res, next);
  } else if (req.body.cmd == "getsjcount") {
    console.log('getsjcount');
    infoDao.getsjcount(req, res, next);
  } else if (req.body.cmd == "getsjlist") {
    console.log('getsjlist');
    infoDao.getsjlist(req, res, next);
  } else if (req.body.cmd == "getjylist") {
    console.log('getjylist');
    infoDao.getjylist(req, res, next);
  } else if (req.body.cmd == "getjymx") {
    console.log('getjymx');
    infoDao.getjymx(req, res, next);
  } else if (req.body.cmd == "getjymx_wlqr") {
    console.log('getjymx_wlqr');
    infoDao.getjymx_wlqr(req, res, next);
  } else if (req.body.cmd == "getjymx_cpqrn") {
    console.log('getjymx_cpqrn');
    infoDao.getjymx_cpqrn(req, res, next);
  } else if (req.body.cmd == "getjymx_cpqry") {
    console.log('getjymx_cpqry');
    infoDao.getjymx_cpqry(req, res, next);
  } else if (req.body.cmd == "getcsbz") {
    console.log('getcsbz');
    infoDao.getcsbz(req, res, next);
  } else if (req.body.cmd == "getcslist") {
    console.log('getcslist');
    infoDao.getcslist(req, res, next);
  } else if (req.body.cmd == "getcslist_cpqry") {
    console.log('getcslist_cpqry');
    infoDao.getcslist_cpqry(req, res, next);
  } else if (req.body.cmd == "updatesjbegintime") {
    console.log('updatesjbegintime');
    infoDao.updatesjbegintime(req, res, next);
  } else if (req.body.cmd == "updatesjcs") {
    console.log('updatesjcs');
    infoDao.updatesjcs(req, res, next);
  } else if (req.body.cmd == "updatesjcs_cpqrn") {
    console.log('updatesjcs_cpqrn');
    infoDao.updatesjcs_cpqrn(req, res, next);
  } else if (req.body.cmd == "updatesjcs_cpqry") {
    console.log('updatesjcs_cpqry');
    infoDao.updatesjcs_cpqry(req, res, next);
  } else if (req.body.cmd == "updatejymx") {
    console.log('updatejymx');
    infoDao.updatejymx(req, res, next);
  } else if (req.body.cmd == "updatesjjy") {
    console.log('updatesjjy');
    infoDao.updatesjjy(req, res, next);
  } else if (req.body.cmd == "getxjcount_nnn") {
    console.log('getxjcount_nnn');
    infoDao.getxjcount_nnn(req, res, next);
  } else if (req.body.cmd == "getxjlist") {
    console.log('getxjlist');
    infoDao.getxjlist(req, res, next);
  } else if (req.body.cmd == "updatesjmxBeginTime") {
    console.log('updatesjmxBeginTime');
    infoDao.updatesjmxBeginTime(req,res,next);
  } else if (req.body.cmd == "getcpjcount") {
    console.log('getcpjcount');
    infoDao.getcpjcount(req, res, next);
  } else if (req.body.cmd == "getcpjlist") {
    console.log('getcpjlist');
    infoDao.getcpjlist(req, res, next);
  } else if (req.body.cmd == "getcpjjylist") {
    console.log('getcpjjylist');
    infoDao.getcpjjylist(req, res, next);
  } else if (req.body.cmd == "updatecpjjy") {
    console.log('updatecpjjy');
    infoDao.updatecpjjy(req, res, next);
  } else if (req.body.cmd == "getcpjjymx_y") {
    console.log('getcpjjymx_y');
    infoDao.getcpjjymx_y(req, res, next);
  } else if (req.body.cmd == "updatecpjcs_y") {
    console.log('updatecpjcs_y');
    infoDao.updatecpjcs_y(req, res, next);
  } else if (req.body.cmd == "updatecpjcs_n") {
    console.log('updatecpjcs_n');
    infoDao.updatecpjcs_n(req, res, next);
  } else if (req.body.cmd == "updatecpjmxBeginTime") {
    console.log('updatecpjmxBeginTime');
    infoDao.updatecpjmxBeginTime(req,res,next);
  } else if (req.body.cmd == "getcpjjymx_n") {
    console.log('getcpjjymx_n');
    infoDao.getcpjjymx_n(req, res, next);
  } 



  
});


module.exports = router;
