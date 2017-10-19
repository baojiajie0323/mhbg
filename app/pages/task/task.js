//task.js
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

var stepName = [
  { short: 'A', name: '物料清点' },
  { short: 'B', name: '设备调机' },
  { short: 'C', name: '首件确认' },
  { short: 'D', name: '正式生产' },
  { short: 'E', name: '报工送检' }];

Page({
  data: {
    role: '',
    orderList: [],
    contains: function (arr, obj) {
      console.log("asdfasf")
      var i = arr.length;
      while (i--) {
        if (arr[i] === obj) {
          return true;
        }
      }
      return false;
    }
  },
  scanCode: function () {
    var that = this
    wx.scanCode({
      success: function (res) {
        wx.showModal({
          content: res.result,
          showCancel: false,
        });
      },
      fail: function (res) {
      }
    })
  },
  onLoad: function (option) {
    console.log("onLoad", option);
    this.setData({ role: option.role })
  },
  onReady: function () {
    console.log("onReady");
    //wx.startPullDownRefresh();
    this.requestInfo();
  },
  getOrderState: function (taskStateList, tc_afr02, short) {
    for (var i = 0; i < taskStateList.length; i++) {
      if (taskStateList[i].TC_AFQ02 == tc_afr02 && taskStateList[i].TC_AFQ04 == short) {
        return taskStateList[i].TC_AFQ05;
      }
    }
  },
  getOperateList: function (taskStateList, tc_afr02) {
    var { role } = this.data;
    var operatelist = [];
    var checkoperate = (step) => {
      var stepstate = this.getOrderState(taskStateList, tc_afr02, step);
      if (stepstate == "1" || stepstate == "2") {
        if (step == "A") {
          operatelist.push({ name: '物料清点', url: '../wlqd/wlqd' })
        } else if (step == "B") {
          operatelist.push({ name: '设备调机', url: '../sbtj/sbtj' })
        } else if (step == "C") {
          operatelist.push({ name: '首件确认', url: '../sjqr/sjqr' })
        } else if (step == "D") {
          operatelist.push({ name: '正式生产', url: '../zssc/zssc' })
        } else if (step == "E") {
          operatelist.push({ name: '报工送检', url: '../bgsj/bgsj' })
        }
      }
    }
    //   { value: 'JXY', name: '机修员' },
    //     { value: 'SCZZ', name: '生产组长' },
    // { value: 'PGY', name: '品管员' },
    // { value: 'CGY', name: '仓管员' },
    // { value: 'SCJHY', name: '生产计划员' },
    // { value: 'ADMIN', name: '系统管理员' },
    if (role == "JXY") {
      checkoperate("B");
    } else if (role == "SCZZ") {
      checkoperate("A");
      var stepstateA = this.getOrderState(taskStateList, tc_afr02, "A");
      var stepstateB = this.getOrderState(taskStateList, tc_afr02, "B");
      var stepstateD = this.getOrderState(taskStateList, tc_afr02, "D");
      if (stepstateA == "3" && stepstaeB == "3") {
        checkoperate("D");
      }
      if (stepstateD == "3") {
        checkoperate("E");
      }
    } else if (role == "PGY") {
      var stepstateA = this.getOrderState(taskStateList, tc_afr02, "A");
      var stepstateB = this.getOrderState(taskStateList, tc_afr02, "B");
      if (stepstateA == "3" && stepstaeB == "3") {
        checkoperate("C");
      }
    } else if (role == "SCJHY") {
    } else if (role == "ADMIN") {
      checkoperate("A");
      checkoperate("B");
      var stepstateA = this.getOrderState(taskStateList, tc_afr02, "A");
      var stepstateB = this.getOrderState(taskStateList, tc_afr02, "B");
      var stepstateD = this.getOrderState(taskStateList, tc_afr02, "D");
      if (stepstateA == "3" && stepstaeB == "3") {
        checkoperate("C");
        checkoperate("D");
      }
      if (stepstateD == "3") {
        checkoperate("E");
      }
    }
    return operatelist;
  },
  updateTaskState: function (taskStateList) {
    var { orderList } = this.data;
    for (var i = 0; i < orderList.length; i++) {
      var operatelist = this.getOperateList(taskStateList, orderList[i].TC_AFR02);
      var steps = stepName.map((s) => {
        var state = this.getOrderState(taskStateList, orderList[i].TC_AFR02, s.short);
        return {
          done: state == "1" ? false : true,
          current: state == "2" ? true : false,
          text: s.name
        }
      });


      orderList[i].steps = steps;
      orderList[i].operatelist = operatelist;
    }
    this.setData({ orderList });
  },
  requestInfo: function () {
    this.getTodayTask();
  },
  getTodayTask: function () {
    var context = this;
    console.log("request gettodaytask");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'gettodaytask',
        data: {
          today: new Date("2017-10-17").Format('yyyy-MM-dd')
          //beginDate: new Date().Format('yyyy-MM-dd'),
          //endDate: new Date().Format('yyyy-MM-dd'),
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('列表更新成功');
        console.log('request success', result);
        context.setData({
          orderList: result.data.data
        })

        context.getTodayTaskState();
      },

      fail(error) {
        //showModel('请求失败', error);
        console.log('request fail', error);
      },

      complete() {
        console.log('request complete');
        wx.stopPullDownRefresh();
      }
    });
  },
  getTodayTaskState: function () {
    var context = this;
    console.log("request getTodayTaskState");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'gettaskstate',
        data: {
          today: new Date("2017-10-17").Format('yyyy-MM-dd')
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('列表更新成功');
        console.log('request success', result);
        var taskstatelist = result.data.data;
        context.updateTaskState(taskstatelist);
      },

      fail(error) {
        //showModel('请求失败', error);
        console.log('request fail', error);
      },

      complete() {
        console.log('request complete');
        wx.stopPullDownRefresh();
      }
    });
  },
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");
    this.requestInfo();
  }
})
