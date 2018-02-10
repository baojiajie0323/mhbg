//wlqd.js
// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');

const util = require('../../utils/util.js')

Page({
  data: {
    order: {},
    bgsj: {},
    bgsj_lp: {
      // TC_AFM04 10
      // TC_AFM05 箱
    },
    bgsj_bl: [
      // {
      //   TC_AFN04 料件编号
      //   TC_AFN05 品名
      //   TC_AFN06 数量
      //   TC_AFN07 单位
      //   TC_AFN08 不良原因
      //   TC_AFN09 判断结果
      //   TC_AFN10 批号
      //   TC_AFN11 供应商
      // }
    ],
    bllj: [{
      SFA03: '请选择料件编号',
      IMA02: '请选择料件品名'
    }],
    blyy: [{
      'QCE03': '请选择不良原因',
    }],
    blpd: [
      '请选择判断结果',
      '退供应商',
      '满好承担',
      '下阶料报废',
      '退上道工序',
      '供应商承担'
    ],
    blph: [{
      'SFE10': '请选择批号'
    }],
    state: 0,
  },
  onLoad: function (option) {
    console.log("onLoad", option);
    this.setData({ state: option.state, no: option.no, ordertype: option.gy, dh: option.dh, xh: option.xh })
    var no = option.no;
    var ordertype = option.type
    var dh = option.dh;
    var xh = option.xh;
    this.getTaskInfo(no, dh, xh);
  },
  getTaskInfo: function (no, dh,xh) {
    var context = this;
    console.log("request getTaskInfo");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'gettaskinfo',
        data: {
          //today: new Date("2017-10-17").Format('yyyy-MM-dd'),
          today: new Date().Format('yyyy-MM-dd'),
          orderno: no,
          dh,
          xh
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
        context.getBgsj(no, dh,xh);
      },
      fail(error) {
        console.log('request fail', error);
      },
      complete() {
        console.log('request complete');
      }
    });
  },
  getBgsj: function (no, dh,xh) {
    var context = this;
    console.log("request getBgsj");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getbgsj',
        data: {
          //today: new Date("2017-10-17").Format('yyyy-MM-dd'),
          today: new Date().Format('yyyy-MM-dd'),
          orderno: no,
          dh,
          xh,
          user: wx.getStorageSync("USERACCOUNT"),
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
            bgsj: result.data.data.bgsj,
            bgsj_lp: result.data.data.bgsj_lp,
            bgsj_bl: result.data.data.bgsj_bl,
            bllj: context.data.bllj.concat(result.data.data.bgsj_bllj),
            blyy: context.data.blyy.concat(result.data.data.bgsj_blyy),
            blph: context.data.blph.concat(result.data.data.bgsj_blph),
          })
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
          //today: new Date("2017-10-17").Format('yyyy-MM-dd'),
          today: new Date().Format('yyyy-MM-dd'),
          orderno: context.data.no,
          dh: context.data.dh,
          xh: context.data.xh,
          user: wx.getStorageSync("USERACCOUNT"),
          time: new Date().Format('hh:mm:ss'),
          step: 'E'
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
  updateBgsj: function () {
    var context = this;
    console.log("request updateBgsj");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'updatebgsj',
        data: {
          //today: new Date("2017-10-17").Format("yyyy-MM-dd"),
          today: new Date().Format("yyyy-MM-dd"),
          orderno: this.data.no,
          ordertype: this.data.ordertype,
          dh: this.data.dh,
          xh: this.data.xh,
          user: wx.getStorageSync("USERACCOUNT"),
          bgsj_lp: this.data.bgsj_lp,
          bgsj_bl: this.data.bgsj_bl,
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
      content: "确定要开始报工送检吗？",
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
    var { bgsj_lp, bgsj_bl } = this.data;
    for (var i = 0; i < bgsj_bl.length; i++) {
      var lj = bgsj_bl[i];
      if (!lj.TC_AFN04 || !lj.TC_AFN05 || !lj.TC_AFN06
        || !lj.TC_AFN08 || !lj.TC_AFN09) {
        wx.showModal({
          title: '提示',
          content: '请填写结果',
          showCancel: false
        })
        return false;
      }
    }
    if (!bgsj_lp.TC_AFM04) {
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
      content: "确定要提交报工送检信息吗？",
      confirmText: "确定",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          this.updateBgsj();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onLpInput: function (e) {
    var { bgsj_lp } = this.data;
    bgsj_lp.TC_AFM04 = parseInt(e.detail.value);
    this.setData({ bgsj_lp })
  },
  onBlInput: function (e) {
    var { bgsj_bl, blph } = this.data;
    var key = e.target.id;
    var index = e.target.dataset.index;
    if (bgsj_bl.length > index) {
      if (bgsj_bl[index].hasOwnProperty(key)) {
        bgsj_bl[index][key] = e.detail.value;
        if (key == "TC_AFN04_index") {
          bgsj_bl[index]["TC_AFN04"] = this.data.bllj[e.detail.value].SFA03;
          bgsj_bl[index]["TC_AFN05"] = this.data.bllj[e.detail.value].IMA02;

        } else if (key == "TC_AFN08_index") {
          bgsj_bl[index]["TC_AFN08"] = this.data.blyy[e.detail.value].QCE03;
        } else if (key == "TC_AFN09_index") {
          bgsj_bl[index]["TC_AFN09"] = this.data.blpd[e.detail.value];
        } else if (key == "TC_AFN10_index") {
          bgsj_bl[index]["TC_AFN10"] = this.data.blph[e.detail.value].SFE10;
        }
      }
    }
    this.setData({ bgsj_bl })
  },
  ontapAddLJ: function (e) {
    var { bgsj_bl } = this.data;
    bgsj_bl.push({
      TC_AFN04: '',
      TC_AFN04_index: 0,
      TC_AFN05: '',
      TC_AFN06: '',
      TC_AFN07: '',
      TC_AFN08: '',
      TC_AFN08_index: 0,
      TC_AFN09: '',
      TC_AFN09_index: 0,
      TC_AFN10: '',
      TC_AFN10_index: 0,
      TC_AFN11: '',
    })
    this.setData({ bgsj_bl })
  },
  onRemoveLJ: function (e) {
    var index = e.target.id;
    wx.showModal({
      content: "确定要删除这个料件吗？",
      confirmText: "确定",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          var { bgsj_bl } = this.data;
          if (bgsj_bl.length > index) {
            bgsj_bl.splice(index, 1);
            this.setData({ bgsj_bl });
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  bindblyyChange: function (e) {
    console.log('bindblyyChange', e);
    var { bgsj_bl } = this.data;
    var key = e.target.id;
    var index = e.target.dataset.index;
    if (bgsj_bl.length > index) {
      if (bgsj_bl[index].hasOwnProperty(key)) {
        bgsj_bl[index][key] = e.detail.value;
      }
    }
    this.setData({ bgsj_bl })
  },
})
