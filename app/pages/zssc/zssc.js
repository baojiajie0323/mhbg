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
    zssc: {
      // TC_AFL04: '1线',
      // TC_AFL05: 3,
    },
    state: 0,
  },
  onLoad: function (option) {
    console.log("onLoad", option);
    this.setData({ state: option.state, no: option.no, ordertype: option.gy, dh: option.dh, xh: option.xh })
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
        context.getZssc(no,dh,xh);
      },
      fail(error) {
        console.log('request fail', error);
      },
      complete() {
        console.log('request complete');
      }
    });
  },
  getZssc: function (no, dh,xh) {
    var context = this;
    console.log("request getZssc");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getzssc',
        data: {
          //today: new Date("2017-10-17").Format('yyyy-MM-dd'),
          today: new Date().Format('yyyy-MM-dd'),
          orderno: no,
          dh,
          xh,
          user: wx.getStorageSync("USERACCOUNT"),
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('列表更新成功');
        console.log('request success', result);
        if (result.data.data.length > 0) {
          var {order} = context.data;
          var zssc = result.data.data[0];
          if (!zssc.TC_AFL06){
            zssc.TC_AFL06 = order.TC_AFR05;
          }
          context.setData({ zssc })
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
  updateTaskState: function (stateTypeString) {
    var context = this;
    var time = new Date().Format('hh:mm:ss');
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
          user: wx.getStorageSync("USERACCOUNT"),
          time,
          step: 'D'
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('列表更新成功');
        console.log('request success', result);
        if (result.data.code == 0) {
          var { zssc } = context.data;
          zssc.TC_AFQ06 = time;
          context.setData({
            state: stateTypeString == "begintask" ? 2 : 3,
            zssc
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
  updateZssc: function () {
    var context = this;
    console.log("request updateZssc");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'updatezssc',
        data: {
          //today: new Date("2017-10-17").Format("yyyy-MM-dd"),
          today: new Date().Format("yyyy-MM-dd"),
          orderno: this.data.no,
          ordertype: this.data.type,
          dh: this.data.dh,
          xh: this.data.xh,
          user: wx.getStorageSync("USERACCOUNT"),
          zssc: this.data.zssc
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
      content: "确定要开始正式生产吗？",
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
    var { zssc } = this.data;
    if (!zssc.TC_AFL04 || !zssc.TC_AFL05 || !zssc.TC_AFL06) {
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
      content: "确定要提交正式生产信息吗？",
      confirmText: "确定",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          this.updateZssc();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onBindInput: function (e) {
    var { zssc } = this.data;
    var key = e.target.id;
    if (zssc.hasOwnProperty(key)) {
      zssc[key] = e.detail.value;
    }
    this.setData({ zssc })
  },
  onBindtapIE: function(e){
    var { zssc,order } = this.data;
    var filename = `https://62771876.myhome-sh.cn/mhbg/image/${order.TC_AFR04}_${order.TC_AFR09}.png`;
    wx.previewImage({
      urls: [filename]
    })
  }
})
