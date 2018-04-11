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
    this.setData({bx: JSON.parse(option.bx)})
    // this.setData({ role: option.role, rolename: option.rolename, name: option.name, usertype: option.usertype, user: option.user, tasktype: option.usertype })
  },
  onShow: function () {
    this.requestInfo();
    this.updateBxStatus( '2', 'A');
  },
  requestInfo: function () {
    this.getFplist();
  },
  getFplist: function () {
    var context = this;
    console.log("request getFplist");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getfplist',
        data: {
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('列表更新成功');
        console.log('request success', result);
        context.setData({
          fplist: result.data.data
        })
      },

      fail(error) {
        //showModel('请求失败', error);
        console.log('request fail', error);
      },

      complete() {
        console.log('request complete');
      }
    });
  },
  onzpInput: function (e) {
    var key = e.target.id;
    console.log('onzpInput', e);
    //this.setData({ bgsj_bl })
    if (key == "zpry") {
      this.setData({ zpry: e.detail.value })
    }
  },
  onClickOK: function () {
    const { zpry } = this.data;
    if (!zpry) {
      wx.showModal({
        title: '提示',
        content: '请填写记录',
        showCancel: false
      })
      return;
    }
    wx.showModal({
      content: "确定要提交维修指派记录吗？",
      confirmText: "确定",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          this.updateZpRecord();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  updateZpRecord: function () {
    const { bx, zpry, fplist } = this.data;
    var context = this;
    console.log("request updateZpRecord");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'updatezpinfo',
        data: {
          sbbh: bx.TC_BAB01,
          bxdate: bx.TC_BAB03,
          bxtime: bx.TC_BAB04,
          zpry: fplist[zpry].TC_AFV05,
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
          context.updateBxStatus('3','A');
          context.updateBxStatus('1','B');
          wx.navigateBack();
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
  updateBxStatus: function (bxtype,bxstatus) {
    const { bx } = this.data;
    var context = this;
    console.log("request updateBxStatus");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'updatebxstatus',
        data: {
          sbbh: bx.TC_BAB01,
          bxdate: bx.TC_BAB03,
          bxtime: bx.TC_BAB04,
          bxtype,
          bxstatus
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('更新物料清点信息成功');
        console.log('request success', result);
        if (result.data.code == 0) {
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
