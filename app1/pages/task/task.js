//task.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: [],
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
