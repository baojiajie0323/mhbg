//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
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
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.getSetting({
      success: (res) => {
        console.log(res);
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success: () => {
              wx.getUserInfo({
                success: res => {
                  app.globalData.userInfo = res.userInfo
                  this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                  })
                }
              })
            }
          })
        }
        /*
         * res.authSetting = {
         *   "scope.userInfo": true,
         *   "scope.userLocation": true
         * }
         */
      }
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  startbg: function(){
    wx.navigateTo({
      url: '../task/task'
    })
  }
})
