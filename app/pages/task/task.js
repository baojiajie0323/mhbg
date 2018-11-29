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
    name: '',
    orderList: [],
    taskstatelist: [],
    title: '下拉刷新任务列表',
    tasktype: 1
  },
  scanCode: function () {
    var context = this
    wx.scanCode({
      success: function (res) {
        var resultcontent = "";
        var taskInfo = context.getTaskInfo(res.result);
        if (taskInfo) {
          var operateList = context.getOperateList(context.data.taskstatelist, taskInfo.TC_AFR02, taskInfo.TC_AFR04, taskInfo.TC_AFR12, taskInfo.TC_AFR14, taskInfo.TC_AFR13, taskInfo.TC_AFT08);
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
                    if (operateList.length > res.tapIndex) {
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
  switchTaskType: function () {
    var { tasktype, taskstatelist } = this.data;
    console.log('switchTaskType', tasktype);
    tasktype = tasktype == 1 ? 2 : 1;
    this.setData({ tasktype }, () => {
      this.updateTaskState(taskstatelist);
    });
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
    this.setData({
      role: wx.getStorageSync('role'),
      rolename: wx.getStorageSync('rolename'), 
      name: wx.getStorageSync('name'), 
      usertype: wx.getStorageSync('usertype'), 
      user: wx.getStorageSync('user'), 
      tasktype: wx.getStorageSync('usertype')
    })
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
  getOrderState: function (taskStateList, tc_afr02, tc_afr12, tc_afr14, short, tc_aft08) {
    var { usertype, role } = this.data;
    var state = '1';
    for (var i = 0; i < taskStateList.length; i++) {
      if (taskStateList[i].TC_AFQ02 == tc_afr02 && taskStateList[i].TC_AFQ12 == tc_afr12 && taskStateList[i].TC_AFQ13 == tc_afr14 && taskStateList[i].TC_AFQ04 == short) {
        //如果是个人工单类型，并且不是物料轻点步骤的需要匹配到工号，因为物料清点个人工单也是公用的。
        if (tc_aft08 && short != 'A') {
          if (tc_aft08 == taskStateList[i].TC_AFQ15) {
            return taskStateList[i].TC_AFQ05;
          }
        }
        else if (role == 'PGY' && short == 'C' && tc_aft08 != null) {
          if (tc_aft08 == taskStateList[i].TC_AFQ15) {
            return taskStateList[i].TC_AFQ05;
          }
        }
        else {
          if (tc_aft08 && short == 'A') {
            if (taskStateList[i].TC_AFQ05 > state) {
              state = taskStateList[i].TC_AFQ05;
            }
          } else {
            return taskStateList[i].TC_AFQ05;
          }
        }
      }
    }
    return state;
  },
  getOperateList: function (taskStateList, tc_afr02, tc_afr04, tc_afr12, tc_afr14, tc_afr13, tc_aft08) {
    var { role, user, usertype } = this.data;
    var operatelist = [];
    var checkoperate = (step) => {
      console.log('checkoperate', usertype, tc_afr13)
      if (usertype == 1 && tc_afr13 == 2 && role != "PGY" && role != "SCZZ_JXY") {
        return;
      }
      var stepstate = this.getOrderState(taskStateList, tc_afr02, tc_afr12, tc_afr14, step, tc_aft08);
      if (stepstate == "1" || stepstate == "2") {
        if (step == "A") {
          operatelist.push({ name: '物料清点', url: `../wlqd/wlqd?no=${tc_afr02}&dh=${tc_afr12}&xh=${tc_afr14}&gy=${tc_afr04}&worker=${tc_aft08 ? tc_aft08 : 'tiptop'}&state=${stepstate}` })
        } else if (step == "B") {
          operatelist.push({ name: '设备调机', url: `../sbtj/sbtj?no=${tc_afr02}&dh=${tc_afr12}&xh=${tc_afr14}&gy=${tc_afr04}&worker=${tc_aft08 ? tc_aft08 : 'tiptop'}&state=${stepstate}` })
        } else if (step == "C") {
          operatelist.push({ name: '首件确认', url: `../sjqr/sjqr?no=${tc_afr02}&dh=${tc_afr12}&xh=${tc_afr14}&gy=${tc_afr04}&worker=${tc_aft08 ? tc_aft08 : 'tiptop'}&state=${stepstate}` })
        } else if (step == "D") {
          operatelist.push({ name: '正式生产', url: `../zssc/zssc?no=${tc_afr02}&dh=${tc_afr12}&xh=${tc_afr14}&gy=${tc_afr04}&worker=${tc_aft08 ? tc_aft08 : 'tiptop'}&state=${stepstate}` })
        } else if (step == "E") {
          operatelist.push({ name: '报工送检', url: `../bgsj/bgsj?no=${tc_afr02}&dh=${tc_afr12}&xh=${tc_afr14}&gy=${tc_afr04}&worker=${tc_aft08 ? tc_aft08 : 'tiptop'}&state=${stepstate}` })
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
      var stepstateA = this.getOrderState(taskStateList, tc_afr02, tc_afr12, tc_afr14, "A", tc_aft08);
      var stepstateB = this.getOrderState(taskStateList, tc_afr02, tc_afr12, tc_afr14, "B", tc_aft08);
      var stepstateC = this.getOrderState(taskStateList, tc_afr02, tc_afr12, tc_afr14, "C", tc_aft08);
      var stepstateD = this.getOrderState(taskStateList, tc_afr02, tc_afr12, tc_afr14, "D", tc_aft08);
      if (stepstateA == "3" && stepstateB == "3" && stepstateC == "3") {
        checkoperate("D");
      }
      if (stepstateD == "3") {
        checkoperate("E");
      }
    } else if (role == "PGY") {
      var stepstateA = this.getOrderState(taskStateList, tc_afr02, tc_afr12, tc_afr14, "A", tc_aft08);
      var stepstateB = this.getOrderState(taskStateList, tc_afr02, tc_afr12, tc_afr14, "B", tc_aft08);
      if (stepstateA == "3" && stepstateB == "3") {
        checkoperate("C");
      }
    } else if (role == "SCJHY") {
    } else if (role == "ADMIN") {
      checkoperate("A");
      checkoperate("B");
      var stepstateA = this.getOrderState(taskStateList, tc_afr02, tc_afr12, tc_afr14, "A", tc_aft08);
      var stepstateB = this.getOrderState(taskStateList, tc_afr02, tc_afr12, tc_afr14, "B", tc_aft08);
      var stepstateC = this.getOrderState(taskStateList, tc_afr02, tc_afr12, tc_afr14, "C", tc_aft08);
      var stepstateD = this.getOrderState(taskStateList, tc_afr02, tc_afr12, tc_afr14, "D", tc_aft08);
      if (stepstateA == "3" && stepstateB == "3") {
        checkoperate("C");
      }
      if (stepstateA == "3" && stepstateB == "3" && stepstateC == "3") {
        checkoperate("D");
      }
      if (stepstateD == "3") {
        checkoperate("E");
      }
    } else if (role == "SCZZ_JXY") {
      checkoperate("A");
      checkoperate("B");
      var stepstateA = this.getOrderState(taskStateList, tc_afr02, tc_afr12, tc_afr14, "A", tc_aft08);
      var stepstateB = this.getOrderState(taskStateList, tc_afr02, tc_afr12, tc_afr14, "B", tc_aft08);
      var stepstateC = this.getOrderState(taskStateList, tc_afr02, tc_afr12, tc_afr14, "C", tc_aft08);
      var stepstateD = this.getOrderState(taskStateList, tc_afr02, tc_afr12, tc_afr14, "D", tc_aft08);
      if (stepstateA == "3" && stepstateB == "3" && stepstateC == "3") {
        checkoperate("D");
      }
      if (stepstateD == "3") {
        checkoperate("E");
      }
    }
    return operatelist;
  },
  updateTaskState: function (taskStateList) {
    var { orderList, tasktype, user, usertype, role } = this.data;
    var allOrder = 0;
    var finishOrder = 0;
    var realorderList = [];
    var realorderList_merge = [];
    for (var i = 0; i < orderList.length; i++) {
      if (orderList[i].TC_AFR13 != tasktype) {
        continue;
      }
      if (usertype == 2) {
        if (orderList[i].TC_AFT08 != user) {
          continue;
        }
      }
      var operatelist = this.getOperateList(taskStateList, orderList[i].TC_AFR02, orderList[i].TC_AFR04, orderList[i].TC_AFR12, orderList[i].TC_AFR14, orderList[i].TC_AFR13, orderList[i].TC_AFT08);
      var xjurl = `../cyxj/cyxj?no=${orderList[i].TC_AFR02}&dh=${orderList[i].TC_AFR12}&xh=${orderList[i].TC_AFR14}&gy=${orderList[i].TC_AFR04}&worker=${orderList[i].TC_AFT08 ? orderList[i].TC_AFT08 : 'tiptop'}`
      var steps = [];
      var bFinish = true;
      for (var j = 0; j < stepName.length; j++) {
        var s = stepName[j];
        var state = this.getOrderState(taskStateList, orderList[i].TC_AFR02, orderList[i].TC_AFR12, orderList[i].TC_AFR14, s.short, orderList[i].TC_AFT08);
        if (state != "3") {
          bFinish = false;
        }
        steps.push({
          done: state == "1" ? false : true,
          current: state == "2" ? true : false,
          text: s.name
        })
      }
      allOrder++;
      if (bFinish) {
        finishOrder++;
      }
      orderList[i].steps = steps;
      orderList[i].operatelist = operatelist;
      orderList[i].xjurl = xjurl;
      realorderList.push(orderList[i]);
    }
    var title = `已完成${finishOrder}/${allOrder}个`;

    if (usertype == 1 && tasktype == 2 && role != 'PGY' && role != 'SCZZ_JXY') {
      var existOrder = function (TC_AFR02, TC_AFR12, TC_AFR14) {
        for (var i = 0; i < realorderList_merge.length; i++) {
          if (realorderList_merge[i].TC_AFR02 == TC_AFR02 &&
            realorderList_merge[i].TC_AFR12 == TC_AFR12 &&
            realorderList_merge[i].TC_AFR14 == TC_AFR14) {
            return realorderList_merge[i];
          }
        }
      }
      for (var i = 0; i < realorderList.length; i++) {
        var order = realorderList[i];
        order.userStep = {
          user: order.TC_AFV05,
          steps: order.steps
        }
        var taskOrder = existOrder(order.TC_AFR02, order.TC_AFR12, order.TC_AFR14);
        if (taskOrder) {
          taskOrder.userSteps.push(order.userStep);
        } else {
          order.userSteps = [order.userStep];
          realorderList_merge.push(order);
        }
      }
    }
    this.setData({ orderList, realorderList, realorderList_merge, title });
  },
  requestInfo: function () {
    if(this.data.role == 'GCWX'){
      return;
    }
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
          //stoday: new Date("2017-10-17").Format('yyyy-MM-dd')
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
  },
  onClickxj: function () {
    console.log("onclickxj")
  }
})
