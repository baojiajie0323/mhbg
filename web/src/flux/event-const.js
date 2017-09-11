'use strict';

var keyMirror = require('keymirror');

module.exports = {
  ActionEvent: keyMirror({
    AE_LOGIN:null,
    AE_QUERY:null,
    AE_SERIAL:null,
  }),

  StoreEvent: keyMirror({
    SE_RESIZE:null,
    SE_KEYDOWN:null,
    SE_LOGIN:null,
    SE_NUMBER:null,
    SE_NUMBERLIST:null,
    SE_SERIAL:null,
    })
};
