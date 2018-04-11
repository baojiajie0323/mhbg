//lq.js
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
   sblist:[],
   gdlist:[]
  },
  onLoad: function (option) {
    console.log("onLoad", option);
    this.requestInfo();
    // this.setData({ role: option.role, rolename: option.rolename, name: option.name, usertype: option.usertype, user: option.user, tasktype: option.usertype })
  },
  onShow: function () {
    //this.requestInfo();
  },
  requestInfo: function () {
    this.getGdList();
    this.getSbList();
  },
  getSbList: function () {
    var {cjbh,cjlist} = this.data;
    var context = this;
    console.log("request getSbList");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getsblist',
        data: {
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('列表更新成功');
        console.log('request success', result);
        context.setData({
          sblist: result.data.data
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
  updateGd(gdlist) {
    var gdlist_gd = gdlist.map(g => g.TC_AFR02).uniq();
    var gdlist_gy = gdlist.map(g => g.TC_AFR05).uniq();
    var gdlist_dh = gdlist.map(g => g.TC_AFR12).uniq();
    var gdlist_xh = gdlist.map(g => g.TC_AFR14).uniq();
    var gdlist_lx =[{lx:1,name:'工单报工'},{lx:2,name:'个人报工'}];
    
    this.setData({ gdlist_gd, gdlist_gy, gdlist_dh, gdlist_xh, gdlist_lx});
  },
  getGdList: function () {
    console.log("request getGdList");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'getgdlist',
        data: {
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success: (result) => {
        //showSuccess('列表更新成功');
        console.log('request success', result);
        this.setData({
          gdlist: result.data.data
        })
        this.updateGd(result.data.data);
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
  onsbInput: function (e) {
    const {sblist} = this.data;
    var key = e.target.id;
    console.log('onsbInput',e);
    //this.setData({ bgsj_bl })
    if(key == "sbbh"){
      //var lqbh = lqlist[parseInt(e.detail.value)].TC_AFX01;
      this.setData({ sbbh : e.detail.value})
    }else if(key == "gddh"){
      this.setData({ gddh: e.detail.value})
    } else if (key == "sbwz") {
      this.setData({ sbwz: e.detail.value })
    } else if (key == "gzsm") {
      this.setData({ gzsm: e.detail.value })
    } else if (key == "gdgd") {
      this.setData({ gdgd: e.detail.value })
    } else if (key == "gdgy") {
      this.setData({ gdgy: e.detail.value })
    } else if (key == "gddh") {
      this.setData({ gddh: e.detail.value })
    } else if (key == "gdxh") {
      this.setData({ gdxh: e.detail.value })
    } else if (key == "gdlx") {
      this.setData({ gdlx: e.detail.value })
    }
  },
  onClickOK: function(){
    const{sbbh,sbwz,gzsm,gdgd,gdgy,gddh,gdxh,gdlx} = this.data;
    if (!sbbh || !sbwz || !gzsm || !gdgd || !gdgy || !gddh || !gdxh || !gdlx){
      wx.showModal({
        title: '提示',
        content: '请填写记录',
        showCancel: false
      })
      return;
    }
    wx.showModal({
      content: "确定要提交设备保修记录吗？",
      confirmText: "确定",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          this.insertBxRecord();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  insertBxRecord: function () {
    const { sbbh, sbwz, gzsm, gdgd, gdgy, gddh, gdxh, gdlx, sblist, gdlist_gd, gdlist_gy, gdlist_dh, gdlist_xh,gdlist_lx} = this.data;
    var context = this;
    console.log("request insertBxRecord");
    qcloud.request({
      // 要请求的地址
      url: config.service.requestUrl,
      data: {
        cmd: 'addbxinfo',
        data: {
          sbbh: sblist[sbbh].ECI01,
          sbmc: sblist[sbbh].ECI06,
          sbwz,
          gzsm,
          gdgd:gdlist_gd[gdgd],
          gdgy: gdlist_gy[gdgy],
          gddh: gdlist_dh[gddh],
          gdxh: gdlist_xh[gdxh],
          gdlx: gdlist_lx[gdlx].lx,
          user: wx.getStorageSync("USERNAME")
        }
      },
      method: 'POST',
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: true,

      success(result) {
        //showSuccess('更新物料清点信息成功');
        console.log('request success', result);
        if (result.data.code == 0) {
          //context.updateTaskState('endtask');
          showSuccess("提交记录成功");
          wx.navigateBack()
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
})
