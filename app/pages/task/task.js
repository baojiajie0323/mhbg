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

var stepName = [{ short: 'A', name: '物料清点' }, { short: 'B', name: '设备调机' }, { short: 'C', name: '首件确认' }, { short: 'D', name: '正式生产' }, { short: 'E', name: '报工送检' }];
Page({
  data: {
    steps: [
      {
        current: false,
        done: true,
        text: '物料清点'
      },
      {
        done: true,
        current: false,
        text: '设备调机'
      },
      {
        done: true,
        current: true,
        text: '首件确认'
      },
      {
        done: false,
        current: false,
        text: '正式生产'
      },
      {
        done: false,
        current: false,
        text: '报工送检'
      }
    ],
    orderList: [],
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
  onReady: function () {
    console.log("onReady");
    //wx.startPullDownRefresh();
    this.requestInfo();
  },
  getOrderState: function (taskStateList,tc_afr02, short) {
    for (var i = 0; i < taskStateList.length; i++ ){
      if(taskStateList[i].TC_AFQ02 == tc_afr02 && taskStateList[i].TC_AFQ04 == short){
        return taskStateList[i].TC_AFQ05;
      }
    }
  },
  updateTaskState: function (taskStateList) {
    var { orderList } = this.data;
    for (var i = 0; i < orderList.length; i++) {
      var steps = stepName.map((s) => {
        var state = this.getOrderState(taskStateList, orderList[i].TC_AFR02,s.short);
        return {
          done: state == "1" ? false : true,
          current: state == "2" ? true : false,
          text: s.name
        }
      });
      orderList[i].steps = steps;
    }
    this.setData({ orderList });
    // if (orderList[i].TC_AFR02 == tc_afr02 && orderList[i].TC_AFR04 == tc_afr04) {
    //   return orderList[i];
    // }
    // for (var i = 0;)
    //   console.log(orderList);
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
