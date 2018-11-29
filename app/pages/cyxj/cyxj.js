//sjqr.js
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
    order: {},
    sjqr: {
      //   TC_AFK04: 'ok',
      //   TC_AFK05: '1',
      //   TC_AFK06: 'ok',
      //   TC_AFK07: '',
      //   TC_AFK08: 'ok',
      //   TC_AFK09: '2',
      //   TC_AFK10: 'ok',
      //   TC_AFK11: '3',
    },
    state: 0,
  },
  onLoad: function (option) {
    this.starttime = new Date().Format('hh:mm:ss');
    console.log("onLoad", option);
    this.setData({ state: option.state, no: option.no, ordertype: option.gy, dh: option.dh, xh: option.xh, worker: option.worker })
    var no = option.no;
    var ordertype = option.type
    var dh = option.dh;
    var xh = option.xh;
    this.getTaskInfo(no, dh, xh);
  },
  getTaskInfo: function (no, dh, xh) {
    var context = this;
    console.log("request getTaskInfo");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'gettaskinfo',
        data: {
          //today: new Date("2017-10-17").Format('yyyy-MM-dd'),
          today: new Date().Format('yyyy-MM-dd'),
          orderno: no,
          dh,
          xh
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('列表更新成功');
        console.log('request success', result);
        if (result.data.data.length > 0) {
          context.setData({ order: result.data.data[0] })
        }
        context.getxj(no, dh, xh);
      },
      fail(error) {
        console.log('request fail', error);
      },
      complete() {
        console.log('request complete');
      }
    });
  },
  getxj: function (no, dh, xh) {
    var context = this;
    console.log("request getxj");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getxj',
        data: {
          //today: new Date("2017-10-17").Format('yyyy-MM-dd'),
          today: new Date().Format('yyyy-MM-dd'),
          orderno: no,
          dh,
          xh,
          user: context.data.worker ? context.data.worker : wx.getStorageSync("USERACCOUNT"),
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('列表更新成功');
        console.log('request success', result);
        var sjqrlist = result.data.data;
        var xjtimes = result.data.count;
        var sjqr_wlqr = sjqrlist.filter(s => s.TC_ABL08 == 1);
        var sjqr_sbcs = sjqrlist.filter(s => s.TC_ABL08 == 2);
        var sjqr_cpzl = sjqrlist.filter(s => s.TC_ABL08 == 3);
        context.setData({ sjqr_wlqr, sjqr_sbcs, sjqr_cpzl, xjtimes })
      },
      fail(error) {
        console.log('request fail', error);
      },
      complete() {
        console.log('request complete');
      }
    });
  },
  updateTaskState: function (stateTypeString) {
    var context = this;
    console.log("request updateTaskState");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'updatetaskstate',
        data: {
          type: stateTypeString,
          //today: new Date("2017-10-17").Format('yyyy-MM-dd'),
          today: new Date().Format('yyyy-MM-dd'),
          orderno: context.data.no,
          dh: context.data.dh,
          xh: context.data.xh,
          user: context.data.worker ? context.data.worker : wx.getStorageSync("USERACCOUNT"),
          time: new Date().Format('hh:mm:ss'),
          step: 'C'
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('列表更新成功');
        console.log('request success', result);
        if (result.data.code == 0) {
          context.setData({
            state: stateTypeString == "begintask" ? 2 : 3
          })
          if (stateTypeString == "endtask") {
            wx.navigateBack();
          }
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
  updateSjqr: function () {
    var context = this;
    console.log("request updateSbtj");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'updatexj',
        data: {
          //today: new Date("2017-10-17").Format("yyyy-MM-dd"),
          today: new Date().Format("yyyy-MM-dd"),
          orderno: this.data.no,
          ordertype: this.data.ordertype,
          dh: this.data.dh,
          xh: this.data.xh,
          user: context.data.worker ? context.data.worker : wx.getStorageSync("USERACCOUNT"),
          sjqr_wlqr: this.data.sjqr_wlqr,
          sjqr_sbcs: this.data.sjqr_sbcs,
          sjqr_cpzl: this.data.sjqr_cpzl,
          xj:this.data.xj,
          starttime: this.starttime,
          endtime:new Date().Format('hh:mm:ss'),
          xjtimes:this.data.xjtimes
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('更新物料清点信息成功');
        console.log('request success', result);
        // if (result.data.code == 0) {
        //   context.updateTaskState('endtask');
        // }
        wx.navigateBack();
      },
      fail(error) {
        console.log('request fail', error);
      },
      complete() {
        console.log('request complete');
      }
    });
  },
  ontapstart: function () {
    wx.showModal({
      content: "确定要开始首件确认吗？",
      confirmText: "确定",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          this.updateTaskState("begintask");
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  checkSubmit: function () {
    var { sjqr_wlqr, sjqr_sbcs, sjqr_cpzl,xj } = this.data;
    if (sjqr_wlqr.filter(s => !s.TC_ABL15).length > 0 ||
      sjqr_wlqr.filter(s => !s.TC_ABL15).length > 0 ||
      sjqr_wlqr.filter(s => !s.TC_ABL15).length > 0 ||
      !xj) {
      wx.showModal({
        title: '提示',
        content: '请填写结果',
        showCancel: false
      })
      return false;
    }
    return true;
  },
  ontapsubmit: function () {
    if (!this.checkSubmit()) {
      return;
    }
    wx.showModal({
      content: "确定要提交巡检信息吗？",
      confirmText: "确定",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          this.updateSjqr();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  radioChangeCp: function (e) {
    console.log("radioChange", e);
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var sjqr = this.data[type];
    sjqr[index].TC_ABL15 = e.detail.value;
    this.setData({
      [type]: sjqr
    })
  },
  bindCPInput: function (e) {
    console.log("radioChange", e);
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var sjqr = this.data[type];
    sjqr[index].TC_ABL16 = e.detail.value;
    this.setData({
      [type]: sjqr
    })
  },
  bindcyInput: function(e) {
    this.setData({xj: e.detail.value});
  }
})
