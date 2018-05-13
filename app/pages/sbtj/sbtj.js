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
  data: {
    order: {},
    sbtj: [
      // {
      //   TC_AFJ04: '一号机床',
      //   TC_AFJ05: '3线',
      //   TC_AFJ06: '鲍嘉捷',
      //   TC_AFJ07: '左30度',
      //   TC_AFJ08: '平切',
      // }
    ],
    state: 0,
  },
  onLoad: function (option) {
    console.log("onLoad", option);
    this.setData({ state: option.state, no: option.no, ordertype: option.gy, dh: option.dh, xh: option.xh,worker:option.worker })
    var no = option.no;
    var ordertype = option.type
    var dh = option.dh;
    var xh = option.xh;
    this.getTaskInfo(no, dh, xh);
  },
  getTaskInfo: function (no, dh, xh) {
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
        context.getSbtj(no, dh, xh);
      },
      fail(error) {
        console.log('request fail', error);
      },
      complete() {
        console.log('request complete');
      }
    });
  },
  getSbtj: function (no, dh, xh) {
    var context = this;
    console.log("request getSbtj");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getsbtj_n',
        data: {
          //today: new Date("2017-10-17").Format('yyyy-MM-dd'), wx.canIUse(string)
          today: new Date().Format('yyyy-MM-dd'),
          orderno: no,
          dh,
          xh,
          user: context.data.worker? context.data.worker : wx.getStorageSync("USERACCOUNT"),
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('列表更新成功');
        console.log('request success', result);
        context.setData({ sbtj: result.data.data })
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
          user: context.data.worker ? context.data.worker : wx.getStorageSync("USERACCOUNT"),
          time: new Date().Format('hh:mm:ss'),
          step: 'B'
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
  updateSbtj: function () {
    var context = this;
    console.log("request updateSbtj");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'updatesbtj_n',
        data: {
          //today: new Date("2017-10-17").Format("yyyy-MM-dd"),
          today: new Date().Format("yyyy-MM-dd"),
          orderno: this.data.no,
          ordertype: this.data.ordertype,
          dh: this.data.dh,
          xh: this.data.xh,
          user: this.data.worker ? this.data.worker : wx.getStorageSync("USERACCOUNT"),
          sbtj: this.data.sbtj
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
      content: "确定要开始设备调机吗？",
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
    var { sbtj } = this.data;
    for (var i = 0; i < sbtj.length; i++) {
      var lj = sbtj[i];
      if (!lj.TC_ABI12) {
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
    if (!this.checkSubmit()) {
      return;
    }
    wx.showModal({
      content: "确定要提交设备调机信息吗？",
      confirmText: "确定",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          this.updateSbtj();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // onRemoveDevice: function (e) {
  //   console.log(e);
  //   var index = e.target.id;
  //   wx.showModal({
  //     content: "确定要删除这个设备吗？",
  //     confirmText: "确定",
  //     cancelText: "取消",
  //     success: (res) => {
  //       if (res.confirm) {
  //         var { sbtj } = this.data;
  //         if (sbtj.length > index) {
  //           sbtj.splice(index, 1);
  //           this.setData({ sbtj });
  //         }
  //       } else if (res.cancel) {
  //         console.log('用户点击取消')
  //       }
  //     }
  //   })
  // },
  // ontapAddDevice() {
  //   var { sbtj } = this.data;
  //   sbtj.push({
  //     TC_AFJ04: '',
  //     TC_AFJ05: '',
  //     TC_AFJ06: '',
  //     TC_AFJ07: '',
  //     TC_AFJ08: '',
  //   })
  //   this.setData({ sbtj })
  // },
  bind12Input: function (e) {
    var { sbtj } = this.data;
    var key = e.target.id;
    if (sbtj.length > key) {
      sbtj[key].TC_ABI12 = e.detail.value;
    }
    this.setData({ sbtj })
  },
  // bind05Input: function (e) {
  //   var { sbtj } = this.data;
  //   var key = e.target.id;
  //   if (sbtj.length > key) {
  //     sbtj[key].TC_AFJ05 = e.detail.value;
  //   }
  //   this.setData({ sbtj })
  // },
  // bind06Input: function (e) {
  //   var { sbtj } = this.data;
  //   var key = e.target.id;
  //   if (sbtj.length > key) {
  //     sbtj[key].TC_AFJ06 = e.detail.value;
  //   }
  //   this.setData({ sbtj })
  // },
  // bind07Input: function (e) {
  //   var { sbtj } = this.data;
  //   var key = e.target.id;
  //   if (sbtj.length > key) {
  //     sbtj[key].TC_AFJ07 = e.detail.value;
  //   }
  //   this.setData({ sbtj })
  // },
  // bind08Input: function (e) {
  //   var { sbtj } = this.data;
  //   var key = e.target.id;
  //   if (sbtj.length > key) {
  //     sbtj[key].TC_AFJ08 = e.detail.value;
  //   }
  //   this.setData({ sbtj })
  // },
})
