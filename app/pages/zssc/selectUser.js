// pages/zssc/selectUser.js
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

  /**
   * 页面的初始数据
   */
  data: {
    users: [],
    checkeduser: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var context = this;
    console.log("request getusers");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getusers',
        data: {}
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('列表更新成功');
        console.log('request success', result);
        var users = result.data.data;
        //var departs = [];
        // users.forEach(u => {
        //   if (!departs.some(d => d == u.HRAO02)){
        //     departs.push(u.HRAO02);
        //   }
        // })
        context.setData({
          users
        });
        //var departUsers = users.keyby('HRAO02');
        // if (result.data.data.length > 0) {
        //   var { order } = context.data;
        //   var zssc = result.data.data[0];
        //   if (!zssc.TC_AFL06) {
        //     zssc.TC_AFL06 = order.TC_AFR05;
        //   }
        //   context.setData({ zssc })
        // }
      },
      fail(error) {
        console.log('request fail', error);
      },
      complete() {
        console.log('request complete');
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  checkboxChange: function(e) {
    //var {users} = this.data;
    this.setData({
      checkeduser: e.detail.value
    });
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },

  onClickOK: function(e) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];

    prevPage.setData({
      checkeduser: this.data.checkeduser
    })
    wx.navigateBack({
      delta: 1
    })
  }
})