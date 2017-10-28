//wlqd.js
// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');

const util = require('../../utils/util.js')

Page({
  data: {
    order: {},
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
    state: 0,
  },
  onLoad: function (option) {
    console.log("onLoad", option);
    this.setData({ state: option.state, no: option.no, type: option.type })
    var no = option.no;
    var type = option.type;
    this.getTaskInfo(no, type);
  },
  getTaskInfo: function (no, type) {
    var context = this;
    console.log("request getTaskInfo");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'gettaskinfo',
        data: {
          today: new Date("2017-10-17").Format('yyyy-MM-dd'),
          orderno: no,
          ordertype: type,
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
        context.getBgsj(no, type);
      },
      fail(error) {
        console.log('request fail', error);
      },
      complete() {
        console.log('request complete');
      }
    });
  },
  getBgsj: function (no, type) {
    var context = this;
    console.log("request getBgsj");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getbgsj',
        data: {
          today: new Date("2017-10-17").Format('yyyy-MM-dd'),
          orderno: no,
          ordertype: type,
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('列表更新成功');
        console.log('request success', result);
        if (result.data.code == 0) {
          context.setData({ bgsj: result.data.data.bgsj, bgsj_lp: result.data.data.bgsj_lp, bgsj_bl: result.data.data.bgsj_bl })
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
          today: new Date("2017-10-17").Format('yyyy-MM-dd'),
          orderno: context.data.no,
          ordertype: context.data.type,
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
          today: new Date("2017-10-17").Format("yyyy-MM-dd"),
          orderno: this.data.no,
          ordertype: this.data.type,
          bgsj_lp: this.data.bgsj_lp,
          bgsj_bl: this.data.bgsj_bl
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
        || !lj.TC_AFN08 || !lj.TC_AFN09 || !lj.TC_AFN10 || !lj.TC_AFN11) {
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
    var { bgsj_bl } = this.data;
    var key = e.target.id;
    var index = e.target.dataset.index;
    if (bgsj_bl.length > index) {
      if(bgsj_bl[index].hasOwnProperty(key)){
        bgsj_bl[index][key] = e.detail.value;
      }
    }
    this.setData({ bgsj_bl })
  },
  ontapAddLJ: function (e) {
    var { bgsj_bl } = this.data;
    bgsj_bl.push({
      TC_AFN04: '',
      TC_AFN05: '',
      TC_AFN06: '',
      TC_AFN07: '',
      TC_AFN08: '',
      TC_AFN09: '',
      TC_AFN10: '',
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
})
