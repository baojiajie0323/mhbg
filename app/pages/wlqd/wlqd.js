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
    order: {},
    wlqd: [
      // {
      //   TC_AFI04: "CSBLK039",
      //   TC_AFI05: "Sponcel再生纤维素块-米色",
      //   TC_AFI06: "100x100x40cm",
      //   TC_AFI07: 0.4,
      //   TC_AFI08: "M3",
      //   TC_AFI09: null, 初盘结果
      //   TC_AFI10: null, 初盘说明
      //   TC_AFI11: null, 复盘结果
      //   TC_AFI12: null  复盘说明
      // }
    ],
    state: 0,
  },
  onLoad: function (option) {
    console.log("onLoad", option);
    this.setData({ state: option.state, no: option.no, gy: option.gy, dh: option.dh, xh: option.xh, worker: option.worker })
    var no = option.no;
    var gy = option.gy;
    var dh = option.dh;
    var xh = option.xh;
    this.getTaskInfo(no, gy, dh, xh);
  },
  getTaskInfo: function (no, gy, dh, xh) {
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
          xh,
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
        context.getWlqd(no, gy);
      },
      fail(error) {
        console.log('request fail', error);
      },
      complete() {
        console.log('request complete');
      }
    });
  },
  getWlqd: function (no, gy) {
    var context = this;
    console.log("request getWlqd");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getwlqd',
        data: {
          //today: new Date("2017-10-17").Format('yyyy-MM-dd'),
          today: new Date().Format('yyyy-MM-dd'),
          orderno: no,
          gy
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('列表更新成功');
        console.log('request success', result);

        context.setData({ wlqd: result.data.data })

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
          step: 'A'
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
  updateWlqd: function () {
    var context = this;
    console.log("request updateWlqd");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'updatewlqd',
        data: {
          //today: new Date("2017-10-17").Format("yyyy-MM-dd"),
          today: new Date().Format("yyyy-MM-dd"),
          orderno: this.data.no,
          gy: this.data.gy,
          wlqd: this.data.wlqd
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('更新物料清点信息成功');
        console.log('request success', result);
        if (result.data.code == 0) {
          context.updateTaskState('endtask');
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
  ontapstart: function () {
    wx.showModal({
      content: "确定要开始物料清点吗？",
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
    var { wlqd } = this.data;
    for (var i = 0; i < wlqd.length; i++) {
      var lj = wlqd[i];
      if (!lj.TC_AFI09 || !lj.TC_AFI11) {
        wx.showModal({
          title: '提示',
          content: '请填写结果',
          showCancel: false
        })
        return false;
      }
    }
    return true;
  },
  ontapsubmit: function () {
    if (!this.checkSubmit()) {
      return;
    }
    wx.showModal({
      content: "确定要提交物料清点信息吗？",
      confirmText: "确定",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          this.updateWlqd();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  radioChangeCp: function (e) {
    var { wlqd } = this.data;
    console.log("radioChangeCp", e, wlqd);
    for (var i = 0; i < wlqd.length; i++) {
      var ljInfo = wlqd[i];
      if (ljInfo.TC_AFI04 == e.target.id) {
        ljInfo.TC_AFI09 = e.detail.value;
        break;
      }
    }
    this.setData({ wlqd })
  },
  radioChangeFp: function (e) {
    var { wlqd } = this.data;
    console.log("radioChangeFp", e, wlqd);
    for (var i = 0; i < wlqd.length; i++) {
      var ljInfo = wlqd[i];
      if (ljInfo.TC_AFI04 == e.target.id) {
        ljInfo.TC_AFI11 = e.detail.value;
        break;
      }
    }
    this.setData({ wlqd })
  },
  bindCPInput: function (e) {
    var { wlqd } = this.data;
    console.log("bindCPInput", e, wlqd);
    for (var i = 0; i < wlqd.length; i++) {
      var ljInfo = wlqd[i];
      if (ljInfo.TC_AFI04 == e.target.id) {
        ljInfo.TC_AFI10 = e.detail.value;
        break;
      }
    }
    this.setData({ wlqd })
  },
  bindFPInput: function (e) {
    var { wlqd } = this.data;
    console.log("radioChangeFp", e, wlqd);
    for (var i = 0; i < wlqd.length; i++) {
      var ljInfo = wlqd[i];
      if (ljInfo.TC_AFI04 == e.target.id) {
        ljInfo.TC_AFI12 = e.detail.value;
        break;
      }
    }
    this.setData({ wlqd })
  }
})
