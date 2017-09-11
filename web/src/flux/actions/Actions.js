'use strict';

const AJAXTIMEOUT = 10 * 1000;
import $ from 'jquery';
import { message } from 'antd';
var AppDispatcher = require('../AppDispatcher');
var ActionEvent = require('../event-const').ActionEvent;

var Action = {
  plugin0: function () {
    return document.getElementById('mhplugin');
  },
  addEvent: function (obj, name, func) {
    if (obj.attachEvent) {
      obj.attachEvent("on" + name, func);
    } else {
      obj.addEventListener(name, func, false);
    }
  },
  getErrorStr: function (code) {
    if (code == 1001) {
      return "数据解析失败！";
    } else if (code == 1002) {
      return "未连接服务器！";
    } else if (code == 1003) {
      return "用户名或密码错误！【用户名为工号,密码为身份证后6位】"
    }
    return "未知错误" + code;
  },

  init: function () {
    this.addEvent(this.plugin0(), 'pluginNotify', this.pluginNotify.bind(this));
    var cmd = {
      cmd: 'init'
    }
    this.plugin0().PostCmd(JSON.stringify(cmd));
  },

  login: function (username, password) {
    var cmd = {
      cmd: 'login',
      data: {
        user: username,
        pwd: password
      }
    }
    this.plugin0().PostCmd(JSON.stringify(cmd));
  },

  query: function (number) {
    var cmd = {
      cmd: 'query',
      data: {
        number: number,
      }
    }
    this.plugin0().PostCmd(JSON.stringify(cmd));
  },

  update: function (data) {
    var cmd = {
      cmd: 'update',
      data: data
    }
    console.log(data);
    this.plugin0().PostCmd(JSON.stringify(cmd));
  },

  pluginNotify(notify) {
    console.log(notify);
    var notifyobj = JSON.parse(notify);
    if (notifyobj.code == 1001) {
      message.error(this.getErrorStr(1001));
    }

    switch (notifyobj.cmd) {
      case 'init': {
        if (notifyobj.code != 0) {
          message.error("oracle 连接失败！" + notifyobj.code);
        } else {
          message.success("初始化成功");
        }
      }
        break;
      case 'login': {
        if (notifyobj.code != 0) {
          message.error("登录失败！" + this.getErrorStr(notifyobj.code));
        } else {
          this.dispatch(ActionEvent.AE_LOGIN, true);
          message.success('登录成功');
        }
      }
        break;
      case 'query': {
        if (notifyobj.code == 0) {
          this.dispatch(ActionEvent.AE_QUERY, notifyobj.data);
        }
      }
        break;
      case 'update': {

      }
        break;
      case 'serial': {
        if (notifyobj.code == 0) {
          this.dispatch(ActionEvent.AE_SERIAL, notifyobj.data);
        }
      }
        break;
      default:
        break;
    }
  },


  logout: function () {
    this.dispatch(ActionEvent.AE_LOGIN, false);
  },
  dispatch: function (funname, value) {
    AppDispatcher.dispatch({
      eventName: funname,
      value: value
    });
  }
};

module.exports = Action;
