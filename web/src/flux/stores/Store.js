'use strict';
var AppDispatcher = require('../AppDispatcher');
var Action = require('../actions/Actions');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var EventConst = require('../event-const');
var ActionEvent = EventConst.ActionEvent;
var StoreEvent = EventConst.StoreEvent;

var _loginsuccess = false;
var _curNumber = '';
var _numberList = [
  // {
  //   number:1,
  //   index: 2,
  //   code:'CHILDJDYH1-24-0102003',
  //   name:'彩印塑封袋-巧資加大印花护洗袋'
  // },
  // {
  //   number:1,
  //   index: 4,
  //   code:'CHILDJDYH1-25-0102004',
  //   name:'彩印塑封袋-巧資加小印花护洗袋'
  // },
  // {
  //   number:1,
  //   index: 5,
  //   code:'CHILDJDYH1-26-0102004',
  //   name:'彩印塑封袋-巧資加小印花护洗袋'
  // },
  // {
  //   number:1,
  //   index: 6,
  //   code:'CHILDJDYH1-27-0102004',
  //   name:'彩印塑封袋-巧資加小印花护洗袋'
  // },
  // {
  //   number:1,
  //   index: 7,
  //   code:'CHILDJDYH4-27-0102004',
  //   name:'彩印塑封袋-巧資加小印花护洗袋'
  // }
];
var Store = assign({}, EventEmitter.prototype, {
  postResize: function () {
    this.emitChange(StoreEvent.SE_RESIZE);
  },
  postKeydown: function (keyCode) {
    this.emit(StoreEvent.SE_KEYDOWN, keyCode);
  },

  setLoginsuccess: function (bsuccess) {
    _loginsuccess = bsuccess;
    this.emitChange(StoreEvent.SE_LOGIN);
  },
  getLoginsuccess: function () {
    return _loginsuccess;
  },

  setCurNumber: function (curnumber) {
    _curNumber = curnumber;
    this.emitChange(StoreEvent.SE_NUMBER);
  },
  getCurNumber: function () {
    return _curNumber;
  },

  setNumberList: function (datalist) {
    _numberList = [];
    for (var i = 0; i < datalist.length; i++) {
      if (this.IsNumberInfoExistByCode(datalist[i].code)) {
        continue;
      }
      _numberList.push(datalist[i]);
    }
    this.emitChange(StoreEvent.SE_NUMBERLIST);
  },
  getNumberList: function () {
    var numberlist = [];
    for (var i = 0; i < _numberList.length; i++) {
      var snumber = _numberList[i].number;
      if (numberlist.indexOf(snumber) < 0) {
        numberlist.push(snumber);
      }
    }
    return numberlist;
  },
  getNumberInfoByNumber: function (snumber) {
    var numberInfolist = [];
    for (var i = 0; i < _numberList.length; i++) {
      if (snumber == _numberList[i].number) {
        numberInfolist.push(_numberList[i]);
      }
    }
    return numberInfolist;
  },
  IsNumberInfoExistByCode: function (scode) {
    for (var i = 0; i < _numberList.length; i++) {
      if (scode == _numberList[i].code) {
        return true;
      }
    }
    return false;
  },
  setNumberInfo(snumber, index, code, count, weight) {
    for (var i = 0; i < _numberList.length; i++) {
      console.log(snumber, index, code, count, weight);
      console.log(_numberList[i]);
      if (snumber == _numberList[i].number &&
        index == _numberList[i].index &&
        code == _numberList[i].code
      ) {
        console.log("find!");
        _numberList[i].count = count;
        _numberList[i].weight = weight;
        break;
      }
    }
    this.emitChange(StoreEvent.SE_NUMBERLIST);
  },

  emitChange: function (eventtype) {
    this.emit(eventtype);
  },
  /**
   * @param {function} callback
   */
  addChangeListener: function (eventtype, callback) {
    this.on(eventtype, callback);
  },
  /**
   * @param {function} callback
   */
  removeChangeListener: function (eventtype, callback) {
    this.removeListener(eventtype, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register((action) => {
  switch (action.eventName) {
    case ActionEvent.AE_LOGIN: {
      Store.setLoginsuccess(action.value);
    }
      break;
    case ActionEvent.AE_QUERY: {
      Store.setNumberList(action.value);
    }
      break;
    case ActionEvent.AE_SERIAL: {
      Store.emit(StoreEvent.SE_SERIAL, action.value);
    }
      break;
    case ActionEvent.AE_ORDER: {
      Store.emit(StoreEvent.SE_ORDER, action.value);
    }
      break;
    case ActionEvent.AE_ORDER_DETAIL: {
      Store.emit(StoreEvent.SE_ORDER_DETAIL, action.value);
    }
      break;
    default:
      break;
  }
});

window.Store = Store;
module.exports = Store;
