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
    taskstatelist: [],
    title: '下拉刷新任务列表',
  },
  scanCode: function () {
    var context = this
    wx.scanCode({
      success: function (res) {
        var resultcontent = "";
        var taskInfo = context.getTaskInfo(res.result);
        if (taskInfo) {
          var operateList = context.getOperateList(context.data.taskstatelist, taskInfo.TC_AFR02, taskInfo.TC_AFR04);
          console.log(operateList);
          var itemList = operateList.map((op) => { return op.name });
          resultcontent = `工单单号:${taskInfo.TC_AFR02} \r\n物料名称:${taskInfo.IMA02}`
          wx.showModal({
            title: `扫描成功(${res.result})`,
            content: resultcontent,
            confirmText: "操作",
            cancelText: "取消",
            success: function (res) {
              console.log(res);
              if (res.confirm) {
                wx.showActionSheet({
                  itemList,
                  success: function (res) {
                    console.log(res.tapIndex);
                    if(operateList.length > res.tapIndex){
                      wx.navigateTo({
                        url: operateList[res.tapIndex].url,
                      })
                    }
                  },
                  fail: function (res) {
                    console.log(res.errMsg)
                  }
                })
              } else {
                console.log('用户点击辅助操作')
              }
            }
          });
        } else {
          resultcontent = "无相关信息";
          wx.showModal({
            title: `扫描成功(${res.result})`,
            content: resultcontent,
            confirmText: "确定",
            showCancel: false,
            success: function (res) {
              console.log(res);
              if (res.confirm) {
                console.log('用户点击主操作')
              } else {
                console.log('用户点击辅助操作')
              }
            }
          });
        }
      },
      fail: function (res) {
      }
    })
  },
  getTaskInfo: function (orderno) {
    var { orderList } = this.data;
    for (var i = 0; i < orderList.length; i++) {
      if (orderList[i].TC_AFR02 == orderno) {
        return orderList[i];
      }
    }
  },
  onLoad: function (option) {
    console.log("onLoad", option);
    this.setData({ role: option.role })
  },
  onReady: function () {
    console.log("onReady");
    //wx.startPullDownRefresh();
    //this.requestInfo();
  },
  onShow: function () {
    console.log("onShow");

    this.requestInfo();
  },
  getOrderState: function (taskStateList, tc_afr02, tc_afr04, short) {
    for (var i = 0; i < taskStateList.length; i++) {
      if (taskStateList[i].TC_AFQ02 == tc_afr02 && taskStateList[i].TC_AFQ03 == tc_afr04 && taskStateList[i].TC_AFQ04 == short) {
        return taskStateList[i].TC_AFQ05;
      }
    }
  },
  getOperateList: function (taskStateList, tc_afr02, tc_afr04) {
    var { role } = this.data;
    var operatelist = [];
    var checkoperate = (step) => {
      var stepstate = this.getOrderState(taskStateList, tc_afr02, tc_afr04, step);
      if (stepstate == "1" || stepstate == "2") {
        if (step == "A") {
          operatelist.push({ name: '物料清点', url: `../wlqd/wlqd?no=${tc_afr02}&type=${tc_afr04}&state=${stepstate}` })
        } else if (step == "B") {
          operatelist.push({ name: '设备调机', url: `../sbtj/sbtj?no=${tc_afr02}&type=${tc_afr04}&state=${stepstate}` })
        } else if (step == "C") {
          operatelist.push({ name: '首件确认', url: `../sjqr/sjqr?no=${tc_afr02}&type=${tc_afr04}&state=${stepstate}` })
        } else if (step == "D") {
          operatelist.push({ name: '正式生产', url: `../zssc/zssc?no=${tc_afr02}&type=${tc_afr04}&state=${stepstate}` })
        } else if (step == "E") {
          operatelist.push({ name: '报工送检', url: `../bgsj/bgsj?no=${tc_afr02}&type=${tc_afr04}&state=${stepstate}` })
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
      var stepstateA = this.getOrderState(taskStateList, tc_afr02, tc_afr04, "A");
      var stepstateB = this.getOrderState(taskStateList, tc_afr02, tc_afr04, "B");
      var stepstateD = this.getOrderState(taskStateList, tc_afr02, tc_afr04, "D");
      if (stepstateA == "3" && stepstateB == "3") {
        checkoperate("D");
      }
      if (stepstateD == "3") {
        checkoperate("E");
      }
    } else if (role == "PGY") {
      var stepstateA = this.getOrderState(taskStateList, tc_afr02, tc_afr04, "A");
      var stepstateB = this.getOrderState(taskStateList, tc_afr02, tc_afr04, "B");
      if (stepstateA == "3" && stepstateB == "3") {
        checkoperate("C");
      }
    } else if (role == "SCJHY") {
    } else if (role == "ADMIN") {
      checkoperate("A");
      checkoperate("B");
      var stepstateA = this.getOrderState(taskStateList, tc_afr02, tc_afr04, "A");
      var stepstateB = this.getOrderState(taskStateList, tc_afr02, tc_afr04, "B");
      var stepstateD = this.getOrderState(taskStateList, tc_afr02, tc_afr04, "D");
      if (stepstateA == "3" && stepstateB == "3") {
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
    var allOrder = orderList.length;
    var finishOrder = 0;
    for (var i = 0; i < orderList.length; i++) {
      var operatelist = this.getOperateList(taskStateList, orderList[i].TC_AFR02, orderList[i].TC_AFR04);
      var steps = [];
      var bFinish = true;
      for (var j = 0; j < stepName.length; j++) {
        var s = stepName[j];
        var state = this.getOrderState(taskStateList, orderList[i].TC_AFR02, orderList[i].TC_AFR04, s.short);
        if (state != "3") {
          bFinish = false;
        }
        steps.push({
          done: state == "1" ? false : true,
          current: state == "2" ? true : false,
          text: s.name
        })
      }
      if (bFinish) {
        finishOrder++;
      }
      orderList[i].steps = steps;
      orderList[i].operatelist = operatelist;
    }
    var title = `共${allOrder}个计划，已完成${finishOrder}个 （下拉刷新）`
    this.setData({ orderList, title });
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
          //today: new Date("2017-10-17").Format('yyyy-MM-dd')
          today: new Date().Format('yyyy-MM-dd')
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
          //today: new Date("2017-10-17").Format('yyyy-MM-dd')
          today: new Date().Format('yyyy-MM-dd')
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        showSuccess('列表更新成功');
        console.log('request success', result);
        var taskstatelist = result.data.data;
        context.updateTaskState(taskstatelist);
        context.setData({ taskstatelist });
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
