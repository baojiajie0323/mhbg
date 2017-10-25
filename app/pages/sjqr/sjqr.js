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
    console.log("onLoad", option);
    this.setData({ state: option.state, no: option.no, type: option.type })
    var no = option.no;
    var type = option.type;
    this.getTaskInfo(no, type);
  },
  getTaskInfo: function (no, type) {
    var context = this;
    console.log("request getTaskInfo");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'gettaskinfo',
        data: {
          today: new Date("2017-10-17").Format('yyyy-MM-dd'),
          orderno: no,
          ordertype: type,
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
        context.getSjqr(no, type);
      },
      fail(error) {
        console.log('request fail', error);
      },
      complete() {
        console.log('request complete');
      }
    });
  },
  getSjqr: function (no, type) {
    var context = this;
    console.log("request getSjqr");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getsjqr',
        data: {
          today: new Date("2017-10-17").Format('yyyy-MM-dd'),
          orderno: no,
          ordertype: type,
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('列表更新成功');
        console.log('request success', result);
        if (result.data.data.length > 0) {
          context.setData({ sjqr: result.data.data[0] })
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
    console.log("request updateTaskState");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'updatetaskstate',
        data: {
          type: stateTypeString,
          today: new Date("2017-10-17").Format('yyyy-MM-dd'),
          orderno: context.data.no,
          ordertype: context.data.type,
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
        cmd: 'updatesjqr',
        data: {
          today: new Date("2017-10-17").Format("yyyy-MM-dd"),
          orderno: this.data.no,
          ordertype: this.data.type,
          sjqr: this.data.sjqr
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
    var { sjqr } = this.data;
    if (!sjqr.TC_AFK04 || !sjqr.TC_AFK06 || !sjqr.TC_AFK08 || !sjqr.TC_AFK10) {
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
      content: "确定要提交首件确认信息吗？",
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
  radioChange: function (e) {
    var { sjqr } = this.data;
    console.log("radioChange", e, sjqr);
    var key = e.target.id;
    if (sjqr.hasOwnProperty(key)) {
      sjqr[key] = e.detail.value;
    }
    this.setData({ sjqr })
  },
  bindSjqrInput: function (e) {
    var { sjqr } = this.data;
    console.log("bindSjqrInput", e, sjqr);
    var key = e.target.id;
    if (sjqr.hasOwnProperty(key)) {
      sjqr[key] = e.detail.value;
    }
    this.setData({ sjqr })
  }
})
