//task.js
const util = require('../../utils/util.js')
// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');
// 引入配置
var config = require('../../config');

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
    steps: [
      {
        current: false,
        done: true,
        text: '物料清点',
        desc: '10.01'
      },
      {
        done: true,
        current: false,
        text: '设备调机',
        desc: '10.02'
      },
      {
        done: true,
        current: true,
        text: '首件确认'
      },
      {
        done: false,
        current: false,
        text: '正式生产'
      },
      {
        done: false,
        current: false,
        text: '报工送检'
      }
    ],
    orderList: []
  },
  scanCode: function () {
    var that = this
    wx.scanCode({
      success: function (res) {
        wx.showModal({
          content: res.result,
          showCancel: false,
        });
      },
      fail: function (res) {
      }
    })
  },
  onReady: function () {
    console.log("onReady");
    //wx.startPullDownRefresh();

    this.requestInfo();
  },
  requestInfo: function () {
    var context = this;
    console.log("request getorder");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getorder',
        data: {
          beginDate: '2017-09-01',
          endDate: '2017-09-30',
          //beginDate: new Date().Format('yyyy-MM-dd'),
          //endDate: new Date().Format('yyyy-MM-dd'),
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        showSuccess('列表更新成功');
        console.log('request success', result);
        context.setData({
          orderList: result.data.data
        })
      },

      fail(error) {
        showModel('请求失败', error);
        console.log('request fail', error);
      },

      complete() {
        console.log('request complete');
        wx.stopPullDownRefresh();
      }
    });
  },
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");
    this.requestInfo();
  }
})
