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
   lqlist:[{
     TC_AFX01:'aaa',
     TC_AFX02:'美工刀'
   }, {
     TC_AFX01: 'bb',
     TC_AFX02: '工业剪刀'
   }]
  },
  onLoad: function (option) {
    console.log("onLoad", option);
    this.requestInfo();
    // this.setData({ role: option.role, rolename: option.rolename, name: option.name, usertype: option.usertype, user: option.user, tasktype: option.usertype })
  },
  onShow: function () {
    //this.requestInfo();
  },
  requestInfo: function () {
    this.getLqList();
  },
  getLqList: function () {
    var context = this;
    console.log("request getLqList");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getlqlist',
        data: {
          //stoday: new Date("2017-10-17").Format('yyyy-MM-dd')
          //today: new Date().Format('yyyy-MM-dd')
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('列表更新成功');
        console.log('request success', result);
        context.setData({
          lqlist: result.data.data
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
  onlqInput: function (e) {
    const {lqlist} = this.data;
    var key = e.target.id;
    console.log('onlqInput',e);
    //this.setData({ bgsj_bl })
    if(key == "lqbh"){
      //var lqbh = lqlist[parseInt(e.detail.value)].TC_AFX01;
      this.setData({ lqbh : e.detail.value})
    }else if(key == "lqxh"){
      this.setData({lqxh: e.detail.value})
    } else if (key == "lqsl") {
      this.setData({ lqsl: e.detail.value })
    } else if (key == "jcgh") {
      this.setData({ jcgh: e.detail.value })
    }
  },
  onClickOK: function(){
    const{lqbh,lqxh,lqsl,jcgh} = this.data;
    if(!lqbh || !lqxh || !lqsl || !jcgh){
      wx.showModal({
        title: '提示',
        content: '请填写记录',
        showCancel: false
      })
      return;
    }
    wx.showModal({
      content: "确定要提交利器借出记录吗？",
      confirmText: "确定",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          this.insertBrRecord();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  insertBrRecord: function () {
    const {lqlist,lqbh,lqxh,lqsl,jcgh} = this.data;
    var context = this;
    console.log("request insertBrRecord");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'addbrinfo',
        data: {
          lqbh: lqlist[lqbh].TC_AFX01,
          lqmc: lqlist[lqbh].TC_AFX02,
          lqxh,
          lqsl,
          jcgh
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
