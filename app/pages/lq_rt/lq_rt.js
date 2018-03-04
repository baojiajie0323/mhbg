//lq.js
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
  },
  onLoad: function (option) {
    console.log("onLoad", option);
    this.setData({lq: JSON.parse(option.lq)})
    // this.setData({ role: option.role, rolename: option.rolename, name: option.name, usertype: option.usertype, user: option.user, tasktype: option.usertype })
  },
  onShow: function () {
    //this.requestInfo();
  },
  requestInfo: function () {
  },
  onRtInput: function (e) {
    var key = e.target.id;
    console.log('onRtInput', e);
    //this.setData({ bgsj_bl })
    if (key == "rtgh") {
      //var lqbh = lqlist[parseInt(e.detail.value)].TC_AFX01;
      this.setData({ rtgh: e.detail.value })
    }
  },
  onClickOK: function () {
    const { rtgh } = this.data;
    if (!rtgh) {
      wx.showModal({
        title: '提示',
        content: '请填写记录',
        showCancel: false
      })
      return;
    }
    wx.showModal({
      content: "确定要提交利器归还记录吗？",
      confirmText: "确定",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          this.updateBrRecord();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  updateBrRecord: function () {
    const { lq,rtgh } = this.data;
    var context = this;
    console.log("request updateBrRecord");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'updatertinfo',
        data: {
          lqbh: lq.TC_AFW01,
          lqxh: lq.TC_AFW03,
          jcrq: lq.TC_AFW05,
          jcsj: lq.TC_AFW06,
          rtgh
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('更新物料清点信息成功');
        console.log('request success', result);
        if (result.data.code == 0) {
          //context.updateTaskState('endtask');
          showSuccess("提交记录成功");
          wx.navigateBack()
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
})
