//wlqd.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: [],
    order: {
      pm: '满好通用型海绵百洁布5入',
      no: '441-MH011705020001',
      scfz: '李陈',
      gdlx: '一般工单',
      cpbh: 'MHSSTYX5-12-01',
      kdrq: '2017-08-09',
      scsl: '100',
      scdw: '箱',
    },
    state: 0,
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  },
  ontapstart: function () {
    wx.showModal({
      content: "确定要开始报工送检吗？",
      confirmText: "确定",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          this.setData({
            state: 1
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  ontapsubmit: function () {
    wx.showModal({
      content: "确定要提交报工送检信息吗？",
      confirmText: "确定",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          this.setData({
            state: 2
          })
          wx.navigateBack();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  radioChange: function (e) {
    var { sjqr } = this.data;
    console.log("radioChange", e, sjqr);
    var key = e.target.id;
    if (sjqr.hasOwnProperty(key)) {
      sjqr[key].state = e.detail.value;
    }
    this.setData({ sjqr })
  },
})
