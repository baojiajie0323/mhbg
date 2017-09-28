/**
 * @fileOverview 演示会话服务和 WebSocket 信道服务的使用方式
 */

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

/**
 * 使用 Page 初始化页面，具体可参考微信公众平台上的文档
 */
Page({

  /**
   * 初始数据，我们把服务地址显示在页面上
   */
  data: {
    userInfo: {},
    hasUserInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    items: [
      { value: 'JXY', name: '机修员', checked: 'true' },
      { value: 'SCZZ', name: '生产组长' },
      { value: 'PGY', name: '品管员' },
      { value: 'CGY', name: '仓管员' },
      { value: 'SCJHY', name: '生产计划员' },
      { value: 'ADMIN', name: '系统管理员' },
    ],
    welcomeText: "欢迎使用满好报工系统,请登录微信"
  },

 
  /**
   * 点击「请求」按钮，测试带会话请求的功能
   */
  doRequest() {
    showBusy('正在请求');

    // qcloud.request() 方法和 wx.request() 方法使用是一致的，不过如果用户已经登录的情况下，会把用户的会话信息带给服务器，服务器可以跟踪用户
    qcloud.request({
      // 要请求的地址
      url: this.data.requestUrl,

      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        showSuccess('请求成功完成');
        console.log('request success', result);
      },

      fail(error) {
        showModel('请求失败', error);
        console.log('request fail', error);
      },

      complete() {
        console.log('request complete');
      }
    });
  },
  onLoad: function () {
    // wx.getSetting({
    //   success: (res) => {
    //     console.log(res);
    //     if (!res.authSetting['scope.userInfo']) {
    //       wx.authorize({
    //         scope: 'scope.userInfo',
    //         success: () => {
    //           wx.getUserInfo({
    //             success: res => {
    //               app.globalData.userInfo = res.userInfo
    //               this.setData({
    //                 userInfo: res.userInfo,
    //                 hasUserInfo: true
    //               })
    //             }
    //           })
    //         }
    //       })
    //     }
    //     /*
    //      * res.authSetting = {
    //      *   "scope.userInfo": true,
    //      *   "scope.userLocation": true
    //      * }
    //      */
    //   }
    // })

    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
    // wx.navigateTo({
    //   url: '../task/task'
    // })
  },
  startbg: function () {
    wx.navigateTo({
      url: '../task/task'
    })
    // wx.request({
    //   url: 'https://baojiajie0323.com/login',
    //   method: 'GET',
    //   data: {

    //   },
    //   success: function (result) {
    //     wx.showToast({
    //       title: '请求成功',
    //       icon: 'success',
    //       mask: true,
    //       duration: 2000
    //     })
    //     console.log('request success', result)
    //   },

    //   fail: function ({ errMsg }) {
    //     console.log('request fail', errMsg)
    //   }
    // })
  }
});
