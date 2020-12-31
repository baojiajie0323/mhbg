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
    console.log("sjmx onReady");
    // this.setData({name: wx.getStorageSync("USERNAME")});

    // this.getSjlist();
  },
  onShow: function() {
    console.log('sjmx onshoow');
    var {
      rwbh,
      xh
    } = this.data;
    if (!!rwbh && !!xh) {
      this.getjymx(rwbh, xh);
    }
  },
  onHide: function() {
    console.log('sjmx onhide');
  },
  onLoad: function(options) {
    console.log('sjmx onload');
    var {
      rwbh,
      xh,
      lx,
    } = options;
    console.log(rwbh, xh, lx);
    this.setData({
      rwbh,
      xh,
      lx
    })
    this.getjymx(rwbh, xh);
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
  getjymx: function(rwbh, xh) {
    var context = this;
    console.log("request getjymx");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getjymx',
        data: {
          rwbh,
          xh
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('列表更新成功');
        console.log('request success', result);
        var jymx = result.data.data[0];

        var cylist = Array(parseInt(jymx.TC_TTS09)).fill('');
        context.setData({
          jymx,
          cylist
        })


        context.getcslist(rwbh, xh);
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
  getcslist: function(rwbh, xc) {
    var context = this;
    console.log("request getcslist");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getcslist',
        data: {
          rwbh,
          xc
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('列表更新成功');

        var { cylist } = context.data;
        console.log('request success', result);
        // var csresult = result.data.data;
        // context.setData({
        //   csresult
        // })


        console.log('request success', result);
        var cslist = result.data.data;
        for (var i = 0; i < cslist.length; i++) {
          cylist[cslist[i].TC_BMQ03 - 1] = cslist[i].TC_BMQ04;
        }
        console.log("参数列表", cylist)
        context.setData({ cylist });
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
  onClickjycs: function(e) {
    var {
      rwbh,
      xh,
      wlmc,
      wlbh,
      cysl
    } = this.data;


    var xmbh = e.currentTarget.id;
    var xm = this.data.jymx.find(j => j.TC_BAG04 == xmbh);

    wx.navigateTo({
      url: '../sjcs/sjcs' +
        '?rwbh=' + rwbh +
        '&xh=' + xh +
        '&csmc=' + xm.TC_BAG07 +
        '&xlh=' + xm.TC_BAG08 +
        '&xmbh=' + xmbh +
        '&wlbh=' + wlbh +
        '&cysl=' + cysl,
    })
  },
  updatesjcs: function () {
    var context = this;
    var { cylist, jymx, xh,rwbh } = this.data;

    console.log("request updatesjcs");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'updatesjcs',
        data: {
          rwbh,
          cylist,
          xh,
          sfcl: jymx.TC_TTS15
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
  bindsizeinput: function (e) {
    var { cylist } = this.data;
    var index = e.currentTarget.dataset.index;
    if (index < cylist.length) {
      cylist[index] = e.detail.value;
      this.setData({ cylist });
    }
  },
  checkSubmit: function() {
    var { cylist } = this.data;
    for (var i = 0; i < cylist.length; i++) {
      if (cylist[i] == '') {
        wx.showModal({
          title: '提示',
          content: '测量值不够',
          showCancel: false
        })
        return false;
      }
    }
    return true;
  },
  ontapsubmit: function() {
    if (!this.checkSubmit()) {
      return;
    }
    wx.showModal({
      content: "确定要提交项目明细信息吗？",
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
  }
})