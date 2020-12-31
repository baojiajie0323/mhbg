//task.js
const util = require('../../../utils/util.js')
// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index');
// 引入配置
var config = require('../../../config');

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
  data: {},
  onReady: function() {
    console.log("onReady");
    // this.setData({name: wx.getStorageSync("USERNAME")});

    // this.getSjlist();
  },
  onLoad: function(options) {
    var {
      cysl,
      csmc,
      xlh,
      wlbh,
      xmbh,
    } = options;
    console.log(cysl, csmc, xlh, wlbh, xmbh);
    var cylist = Array(parseInt(cysl)).fill('');
    this.setData({
      cylist,
      csmc,
      xlh,
      xmbh,
      wlbh,
    })

    this.getcsbz(wlbh, xlh, xmbh);
  },
  onClicktask: function(e) {
    console.log("onClicktask", e);
    var orderno = e.currentTarget.dataset.id;
    this.onClickThtask(orderno);
  },
  onClickThtask: function(orderno) {
    var task = this.data.thtask.find(t => t.TC_TTA01 == orderno);
    if (!task) {
      return;
    }
    var url = 'thsm/thsm?orderno=' + orderno +
      '&thkh=' + task.TC_TTA03 +
      wx.navigateTo({
        url
      })
  },
  getcsbz: function(wlbh, xlh, xmbh) {
    var context = this;
    console.log("request getcsbz");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getcsbz',
        data: {
          xlh: wlbh,
          xmbh
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('列表更新成功');
        console.log('request success', result);
        var csbz = {};
        if (result.data.data.length > 0) {
          csbz = result.data.data[0];
          if (!!csbz.TA_QCD04) {
            csbz.TA_QCD04 = parseFloat(csbz.TA_QCD04.toFixed(2))
          }
          if (!!csbz.QCD061) {
            csbz.QCD061 = parseFloat(csbz.QCD061.toFixed(2))
          }
          if (!!csbz.QCD062) {
            csbz.QCD062 = parseFloat(csbz.QCD062.toFixed(2))
          }
        }

        // csbz = {
        //   TA_QCD04: '04',
        //   QCD061: '061',
        //   QCD062: '062',
        // }
        context.setData({
          csbz
        })

        context.getcslist(xlh);
      },

      fail(error) {
        console.log('request fail', error);
      },

      complete() {
        console.log('request complete');
      }
    });
  },
  getcslist: function (xlh) {
    var {cylist} = this.data;
    var context = this;
    console.log("request getcslist");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getcslist',
        data: {
          xlh
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('列表更新成功');
        console.log('request success', result);
        var cslist = result.data.data;
        for(var i = 0; i < cslist.length; i++){
          cylist[cslist[i].TC_BAH02 - 1] = cslist[i].TC_BAH03;
        }
        console.log("参数列表",cylist)
        context.setData({cylist});
      },

      fail(error) {
        console.log('request fail', error);
      },

      complete() {
        console.log('request complete');
      }
    });
  },
  updatesjcs: function () {
    var context = this;
    var {cylist,csbz,xlh} = this.data;
    var cyresult = 'Y';
    if(!!csbz.TA_QCD04){
      for (var i = 0; i < cylist.length; i++) {
        if (parseFloat(cylist[i]) < parseFloat(csbz.QCD061) || parseFloat(cylist[i]) > parseFloat(csbz.QCD062) ){
          cyresult = 'X'
          break;
        }
      }
    }else{
      for (var i = 0; i < cylist.length; i++) {
        if (cylist[i] == 'ng' || cylist == 'NG') {
          cyresult = 'X'
          break;
        }
      }
    }

    console.log("request updatesjcs");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'updatesjcs',
        data: {
          cyresult,
          cylist,
          xlh,
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('更新物料清点信息成功');
        console.log('request success', result);
        wx.navigateBack({
        })
      },
      fail(error) {
        console.log('request fail', error);
      },
      complete() {
        console.log('request complete');
      }
    });
  },
  bindcyslInput: function(e) {

  },
  bindPickerChange: function(e) {
    console.log('bindPickerChange', e.detail.value)
    this.setData({
      curdw: this.data.dwlist[e.detail.value]
    })
  },
  onClickjymx: function(e) {
    console.log("onclickjymx", e);
    var xh = e.currentTarget.id;
  },
  bindsizeinput: function (e) {
    var { cylist } = this.data;
    var index = e.currentTarget.dataset.index;
    if (index < cylist.length) {
      cylist[index] = e.detail.value;
      this.setData({ cylist });
    }
  },

  checkSubmit: function () {
    var { cylist, csbz } = this.data;
    for(var i = 0; i< cylist.length; i++){
      if(cylist[i] == ''){
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
    // wx.navigateBack({
    // });
    // return;

    if (!this.checkSubmit()) {
      return;
    }
    wx.showModal({
      content: "确定要提交参数信息吗？",
      confirmText: "确定",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          this.updatesjcs();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

})