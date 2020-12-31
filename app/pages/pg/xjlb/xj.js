//task.js
const util = require('../../../utils/util.js')
// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index');
// 引入配置
var config = require('../../../config');

// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
});

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
});

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();

  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  });
};


Page({
  data: {
    xjlist: []
  },
  onReady: function () {
    console.log("onReady");

  },
  onShow: function(){
    this.getXjlist();
  },
  onClicktask: function(e){
    console.log("onClicktask",e);
    var orderno = e.currentTarget.dataset.id;
    this.onClickThtask(orderno);
  },
  onClickThtask: function(orderno){
    var task = this.data.xjlist.find(t => t.TC_TTR26 == orderno);
    if(!task){
      return;
    }
    // var nowTime = new Date().Format('hh:mm:ss');
    // if(nowTime > task.TC_TTR15 || nowTime < task.TC_TTR14){
    //   return;
    // }
    var url = '../xjjy/xjjy?rwbh=' + orderno +
      '&pm=' + task.TC_TTR06 +
      '&dh=' + task.TC_TTR04 +
      '&begintime=' + task.TC_TTR16
    wx.navigateTo({
      url
    })
  },
  getXjlist: function () {
    var context = this;
    console.log("request getXjlist");
    var role = wx.getStorageSync("role");
    var useraccount = "";
    if (role == "PGY") {
      useraccount = wx.getStorageSync("user");
    }
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getxjlist',
        data: {
          today: new Date().Format('yyyy-MM-dd'),
          useraccount,
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('列表更新成功');
        console.log('request success', result);
        var xjlist = result.data.data;
        // xjlist = [{
        //   TC_TTR04: '工单号',
        //   TC_TTR05: '材料编号',
        //   TC_TTR06: '品名',
        //   TC_TTR22: '数量单位',
        //   TC_TTR23: '生产工艺',
        //   TC_TTR24: '类型',
        //   TC_TTR19: '检验员',
        //   TC_TTR20: 'N',
        //   TC_TTR26: '任务编号',
        //   TC_TTR14: '09:00:00',
        //   TC_TTR15: '10:00:00',
        // }]
        context.setData({
          xjlist
        })
      },

      fail(error) {
        //showModel('请求失败', error);
        console.log('request fail', error);
      },

      complete() {
        console.log('request complete');
      }
    });
  },
})
