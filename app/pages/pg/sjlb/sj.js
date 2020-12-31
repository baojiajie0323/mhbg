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
    sjlist: []
  },
  onReady: function() {
    console.log("onReady");

  },
  onShow: function() {
    setTimeout(() => {
      this.getSjlist();
    },1000);
  },
  onClicktask: function(e) {
    console.log("onClicktask", e);
    var orderno = e.currentTarget.dataset.id;
    this.onClickThtask(orderno);
  },
  onClickThtask: function(orderno) {
    var task = this.data.sjlist.find(t => t.TC_TTR26 == orderno);
    if (!task) {
      return;
    }
    var url = '../sjjy/sjjy?rwbh=' + orderno +
      '&pm=' + task.TC_TTR06 +
      '&dh=' + task.TC_TTR04 + 
      '&begintime=' + task.TC_TTR16
    wx.navigateTo({
      url
    })
  },
  getSjlist: function() {
    var context = this;
    console.log("request getSjlist");
    var role = wx.getStorageSync("role");
    var useraccount = "";
    if (role == "PGY") {
      useraccount = wx.getStorageSync("user");
    }
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getsjlist',
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
        var sjlist = result.data.data;
        // sjlist = [{
        //   TC_BAC01:'a01',
        //   TC_BAC02: 'a02',
        //   TC_BAC03: 'a03',
        //   TC_BAC04: 'a04',
        //   TC_BAC15: 'a15',
        //   TC_BAC16: 'X',
        //   TC_BAC17: 'a17',
        //   TC_BAC18: 'a18',
        //   TC_BAC19: 'a19',
        // }]
        context.setData({
          sjlist
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