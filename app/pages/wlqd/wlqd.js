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
    lj: [{
      ljbh: 'CPP3101',
      ljmc: '彩印卷膜-237124',
      gg: 'W25*L22cm（OPP2/CPP3,复合亮膜,2专+4色+1 辅白）',
      count: 36,
      dw: 'KG',
      cp: {
        state: 'ok',
        content: ''
      },
      fp: {
        state: 'ok',
        content: ''
      }
    }, {
      ljbh: 'CPP3102',
      ljmc: '彩印卷膜-237124',
      gg: 'W25*L22cm（OPP2/CPP3,复合亮膜,2专+4色+1 辅白）',
      count: 36,
      dw: 'KG',
      cp: {
        state: 'ok',
        content: ''
      },
      fp: {
        state: 'ok',
        content: ''
      }
    },
    ],
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
      content: "确定要开始物料清点吗？",
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
      content: "确定要提交物料清点信息吗？",
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
  radioChangeCp: function (e) {
    var { lj } = this.data;
    console.log("radioChangeCp", e, lj);
    for (var i = 0; i < lj.length; i++) {
      var ljInfo = lj[i];
      if (ljInfo.ljbh == e.target.id) {
        ljInfo.cp.state = e.detail.value;
        break;
      }
    }
    this.setData({ lj })
  },
  radioChangeFp: function (e) {
    var { lj } = this.data;
    console.log("radioChangeFp", e, lj);
    for (var i = 0; i < lj.length; i++) {
      var ljInfo = lj[i];
      if (ljInfo.ljbh == e.target.id) {
        ljInfo.fp.state = e.detail.value;
        break;
      }
    }
    this.setData({ lj })
  },
})
