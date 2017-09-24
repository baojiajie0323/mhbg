//task.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
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
  }
})
