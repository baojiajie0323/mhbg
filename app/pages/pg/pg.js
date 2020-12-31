//wlqd.js
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
    sjcount: 0
  },
  onReady: function () {
    console.log("onReady");
  },
  onLoad: function(){

  },
  onShow: function() {
    this.getSjcount();
    this.getXjcount();
    this.getCpjcount();
  },
  getSjcount:function() {
    var role = wx.getStorageSync("role");
    var useraccount = "";
    if (role == "PGY"){
      useraccount = wx.getStorageSync("user");
    }
    var context = this;
    console.log("request getSjcount");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getsjcount',
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
        if (result.data.data.length > 0) {
          context.setData({ sjcount: result.data.data[0]["COUNT(*)"] })
        }
      },
      fail(error) {
        console.log('request fail', error);
      },
      complete() {
        console.log('request complete');
      }
    });
  },
  getXjcount: function () {
    var role = wx.getStorageSync("role");
    var useraccount = "";
    if (role == "PGY") {
      useraccount = wx.getStorageSync("user");
    }
    var context = this;
    console.log("request getXjcount");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getxjcount_nnn',
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
        if (result.data.data.length > 0) {
          context.setData({ xjcount: result.data.data[0]["COUNT(*)"] })
        }
      },
      fail(error) {
        console.log('request fail', error);
      },
      complete() {
        console.log('request complete');
      }
    });
  },
  getCpjcount: function () {
    // var role = wx.getStorageSync("role");
    // var useraccount = "";
    // if (role == "PGY") {
    //   useraccount = wx.getStorageSync("user");
    // }
    var context = this;
    console.log("request getCpjcount");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getcpjcount',
        data: {
          // today: new Date().Format('yyyy-MM-dd'),
          // useraccount,
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('列表更新成功');
        console.log('request success', result);
        if (result.data.data.length > 0) {
          context.setData({ cpjcount: result.data.data[0]["COUNT(*)"] })
        }
      },
      fail(error) {
        console.log('request fail', error);
      },
      complete() {
        console.log('request complete');
      }
    });
  },
  pg_sj: function(e){
    console.log('pg_sj');
    wx.navigateTo({
      url: './sjlb/sj',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  pg_xj: function (e) {
    console.log('pg_xj');
    wx.navigateTo({
      url: './xjlb/xj',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  pg_cpj: function (e) {
    console.log('pg_cpj');
    wx.navigateTo({
      url: './cpjlb/cpj',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
})
