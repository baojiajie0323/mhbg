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
    bxlist:[]
  },
  onLoad: function (option) {
    console.log("onLoad", option);
    // this.setData({ role: option.role, rolename: option.rolename, name: option.name, usertype: option.usertype, user: option.user, tasktype: option.usertype })
  },
  onShow: function () {
    this.requestInfo();
  },
  requestInfo: function () {
    //this.getLqList();
    this.getBxList();
  },
  getBxList: function () {
    var context = this;
    console.log("request getBxList");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getbxlist',
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
          bxlist: result.data.data
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
  onClickBx(){
    wx.navigateTo({
      url: '../repair_bx/repair_bx',
    })
  },
  onClickZp(e){
    wx.navigateTo({
      url: `../repair_zp/repair_zp?bx=${JSON.stringify(e.currentTarget.dataset.bx)}`,
    })
    console.log(e);
  },
  onClickWx(e) {
    wx.navigateTo({
      url: `../repair_wx/repair_wx?bx=${JSON.stringify(e.currentTarget.dataset.bx)}`,
    })
    console.log(e);
  }
})
