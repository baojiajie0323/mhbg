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
  data: {
    // dwlist: ["PK", "SCS", "PCS", "M3", "M", "M2", "KG", "BLK", "PAIR", "ROLL"],
    // curdw: "",
    jylist: [],
    dh: ''
  },
  onReady: function() {
    console.log("sjjy smzq onReady");
    // this.setData({name: wx.getStorageSync("USERNAME")});

    // this.getSjlist();
  },
  isOver10s: function(nowDateString) {
    var {
      begintime,
      hasbegintime
    } = this.data;
    console.log('isOver10s');
    if (!!hasbegintime) {
      return false;
    }
    var date1 = new Date(`2000-01-01 ${begintime}`); //开始时间
    var date2 = new Date(`2000-01-01 ${nowDateString}`); //结束时间
    var date3 = date2.getTime() - date1.getTime() //时间差的毫秒数
    return date3 >= 10 * 1000;
  },
  onLoad: function(options) {
    console.log("sjjy smzq onLoad")
    var {
      rwbh,
      pm,
      ljbh,
    } = options;
    // console.log(rwbh, pm, dh, begintime);
    this.setData({
      rwbh,
      pm,
      ljbh,
      // hasbegintime: begintime !== 'null',
      // begintime: begintime !== 'null' ? begintime : new Date().Format('hh:mm:ss'),
    })

    this.getjylist(rwbh);
  },
  onShow: function() {
    console.log('sjmx onshoow');
    var {
      rwbh
    } = this.data;
    if (!!rwbh) {
      this.getjylist(rwbh);
    }
  },
  onUnload: function() {
    // console.log('onUnload');
    // var nowDateString = new Date().Format('hh:mm:ss');
    // if (!!this.isOver10s(nowDateString)) {
    //   this.updatesjbegintime();
    //   // console.log("need update starttime!!");
    // }
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
  getjylist: function(rwbh) {
    var context = this;
    console.log("request getjylist");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getcpjjylist',
        data: {
          rwbh
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('列表更新成功');
        console.log('request success', result);
        // var {
        //   wlqr,
        //   sbcs,
        //   cpqr
        // } = result.data.data;

        // context.setData({
        //   // jylist,
        //   jy_wlqr: wlqr,
        //   jy_sbcs: sbcs,
        //   jy_cpzl: cpqr
        // })

        var jylist = result.data.data;
        context.setData({
          jylist
        });


        // context.updatesjbegintime();
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

  bindcyslInput: function(e) {
    this.setData({
      cysl: e.detail.value
    });
  },
  bindCPInput: function(e) {
    var {
      jy_wlqr,
      jy_sbcs,
      jy_cpzl
    } = this.data;
    jy_wlqr.forEach(j => {
      if (j.TC_BAF04 == e.target.id) {
        j.bz = e.detail.value
      }
    })
    jy_sbcs.forEach(j => {
      if (j.TC_BAF04 == e.target.id) {
        j.bz = e.detail.value
      }
    })
    jy_cpzl.forEach(j => {
      if (j.TC_BAF04 == e.target.id) {
        j.bz = e.detail.value
      }
    })
    this.setData({
      jy_wlqr,
      jy_sbcs,
      jy_cpzl
    })
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
    var rwbh = this.data.rwbh;

    var sj = this.data.jylist.find(j => j.TC_TTW03 == xh);
    if (sj.TC_TTW22 == 'Y') {
      wx.navigateTo({
        url: '../cpjmx/cpjmx_y?' +
          'rwbh=' + rwbh +
          '&ljbh=' + sj.TC_TTW03
      })
    } else {
      wx.navigateTo({
        url: '../cpjmx/cpjmx_n?' +
          'rwbh=' + rwbh +
          '&ljbh=' + sj.TC_TTW03
      })
    }
  },

  updatecpjjy: function() {
    var context = this;
    var {
      // begintime,
      // jylist,
      rwbh,
      // hasbegintime
      // cysl,
      // curdw,
    } = this.data;
    console.log("request updatecpjjy");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'updatecpjjy',
        data: {
          // begintime,
          // hasbegintime,
          //jyresult,
          rwbh,
          // xj: true
          // curdw,
          // cysl,
          // nglist
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('更新物料清点信息成功');
        console.log('request success', result);
        wx.navigateBack({})
      },
      fail(error) {
        console.log('request fail', error);
      },
      complete() {
        console.log('request complete');
      }
    });
  },
  updatesjbegintime: function() {
    var context = this;
    var {
      rwbh,
      begintime,
    } = this.data;
    console.log("request updatesjbegintime");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'updatesjbegintime',
        data: {
          begintime,
          rwbh
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('更新物料清点信息成功');
        console.log('request success', result);
        // wx.navigateBack({})
      },
      fail(error) {
        console.log('request fail', error);
      },
      complete() {
        console.log('request complete');
      }
    });
  },
  checkSubmit: function() {
    var {
      jylist
    } = this.data;

    for (var i = 0; i < jylist.length; i++) {
      if (jylist[i].TC_TTW21 == 'N') {
        wx.showModal({
          title: '提示',
          content: '有项目未检验',
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
          this.updatecpjjy();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})