'use strict';

const AJAXTIMEOUT = 10 * 1000;
import $ from 'jquery';
import { message } from 'antd';
var AppDispatcher = require('../AppDispatcher');
var ActionEvent = require('../event-const').ActionEvent;

var Action = {
  getTask() {
    var data = {
      cmd: 'gettask',
      data: 'aabbcc'
    }
    $.ajax({
      url: '../info', type: 'POST', dataType: 'json', timeout: AJAXTIMEOUT,
      data
    })
      .done(function (response) {
        console.log('info:' + response);
      })
      .fail(function (xhr, textStatus, thrownError) {
        console.log('info fail');
      })
  },
  getOrder(queryData) {
    var data = {
      cmd: 'getorder',
      data: queryData
    }
    console.log('getOrder:', data)
    var context = this;
    $.ajax({
      url: '../info', type: 'POST', dataType: 'json', timeout: AJAXTIMEOUT,
      data
    })
      .done(function (response) {
        console.log('getorder:', response.data);
        if (response.code == 0) {
          context.dispatch(ActionEvent.AE_ORDER, response.data);
        } else {
          message.error('获取工单数据失败！');
        }
      })
      .fail(function (xhr, textStatus, thrownError) {
        console.log('getorder fail');
      })
  },
  getOrderDetail(queryData) {
    var data = {
      cmd: 'getorderdetail',
      data: queryData
    }
    var context = this;
    $.ajax({
      url: '../info', type: 'POST', dataType: 'json', timeout: AJAXTIMEOUT,
      data
    })
      .done(function (response) {
        console.log('getorderdetail:' + response);
        if (response.code == 0) {
          context.dispatch(ActionEvent.AE_ORDER_DETAIL, response.data);
        } else {
          message.error('获取工单详情失败！');
        }
      })
      .fail(function (xhr, textStatus, thrownError) {
        console.log('getorderdetail fail');
      })
  },
  dispatch: function (funname, value) {
    AppDispatcher.dispatch({
      eventName: funname,
      value: value
    });
  }
};

module.exports = Action;
