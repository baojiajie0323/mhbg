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
    dwlist: ["PK", "SCS", "PCS", "M3", "M", "M2", "KG", "BLK", "PAIR", "ROLL"],
    curdw: "",
    jylist: [],
  },
  onReady: function() {
    console.log("sjjy smzq onReady");
    // this.setData({name: wx.getStorageSync("USERNAME")});

    // this.getSjlist();
  },
  onLoad: function(options) {
    console.log("sjjy smzq onLoad")
    var {
      rwbh,
      pm,
      lx
    } = options;
    console.log(rwbh, pm, lx);
    this.setData({
      rwbh,
      pm,
      lx,
      begintime: new Date(),
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
        cmd: 'getjylist',
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
        var jylist = result.data.data;

        // jylist = [{
        //     TC_BAF03: 1,
        //     TC_BAF04: 'a04',
        //     TC_BAF05: 'a05',
        //     TC_BAF06: 'a06',
        //     TC_BAF07: 'a07',
        //     TC_BAF08: 'N'
        //   },
        //   {
        //     TC_BAF03: 1,
        //     TC_BAF04: 'b04',
        //     TC_BAF05: 'b05',
        //     TC_BAF06: 'b06',
        //     TC_BAF07: 'b07',
        //     TC_BAF08: 'X'
        //   }
        // ]

        context.setData({
          jylist,
          jy_wlqr: jylist.filter(j => j.TC_BAF03 == 1),
          jy_sbcs: jylist.filter(j => j.TC_BAF03 == 2),
          jy_cpzl: jylist.filter(j => j.TC_BAF03 == 3)
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
    //bjj 判断下是否填写了抽杨数量
    var {
      cysl,
      curdw
    } = this.data;
    if (!cysl) {
      showModel("提示", "请填写抽样数量");
      return;
    }
    if (!curdw) {
      showModel("提示", "请选择抽样单位");
      return;
    }


    console.log("onclickjymx", e);
    var xh = e.currentTarget.id;
    var sj = this.data.jylist.find(j => j.TC_BAF04 == xh);
    var rwbh = this.data.rwbh;
    wx.navigateTo({
      url: '../sjmx/sjmx?' +
        'rwbh=' + rwbh +
        '&xh=' + xh +
        '&wlmc=' + sj.TC_BAF06 +
        '&wlbh=' + sj.TC_BAF05 +
        '&cysl=' + cysl,
    })
  },

  updatesjjy: function() {
    var context = this;
    var {
      begintime,
      jy_wlqr,
      jy_sbcs,
      jy_cpzl,
      rwbh,
      cysl,
      curdw,
    } = this.data;

    var jyresult = "Y";
    var jylist = [...jy_wlqr, ...jy_sbcs, ...jy_cpzl];
    var nglist = jylist.filter(j => j.TC_BAF08 == 'X');
    if (nglist.length > 0) {
      jyresult = "X";
    }

    console.log("request updatesjjy");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'updatesjjy',
        data: {
          begintime,
          jyresult,
          rwbh,
          curdw,
          cysl,
          nglist
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
  checkSubmit: function() {
    var {
      jy_wlqr,
      jy_sbcs,
      jy_cpzl,
      cysl,
      curdw
    } = this.data;
    if (!cysl || !curdw) {
      wx.showModal({
        title: '提示',
        content: '请填写抽样数量和单位',
        showCancel: false
      })
      return false;
    }

    for (var i = 0; i < jy_wlqr.length; i++) {
      if (jy_wlqr[i].TC_BAF08 == 'N') {
        wx.showModal({
          title: '提示',
          content: '有项目未检验',
          showCancel: false
        })
        return false;
      } else if (jy_wlqr[i].TC_BAF08 == 'X' && !jy_wlqr[i].bz) {
        wx.showModal({
          title: '提示',
          content: '请填写NG原因',
          showCancel: false
        })
        return false;
      }
    }
    for (var i = 0; i < jy_sbcs.length; i++) {
      if (jy_sbcs[i].TC_BAF08 == 'N') {
        wx.showModal({
          title: '提示',
          content: '有项目未检验',
          showCancel: false
        })
        return false;
      } else if (jy_sbcs[i].TC_BAF08 == 'X' && !jy_sbcs[i].bz) {
        wx.showModal({
          title: '提示',
          content: '请填写NG原因',
          showCancel: false
        })
        return false;
      }
    }
    for (var i = 0; i < jy_cpzl.length; i++) {
      if (jy_cpzl[i].TC_BAF08 == 'N') {
        wx.showModal({
          title: '提示',
          content: '有项目未检验',
          showCancel: false
        })
        return false;
      } else if (jy_cpzl[i].TC_BAF08 == 'X' && !jy_cpzl[i].bz) {
        wx.showModal({
          title: '提示',
          content: '请填写NG原因',
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
          this.updatesjjy();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})