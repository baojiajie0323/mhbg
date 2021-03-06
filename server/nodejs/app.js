'use strict';

require('./globals');
require('./setup-qcloud-sdk');

const http = require('http');
var path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');
var info = require('./routes/info');
var _dao = require('./dao/dao');

const app = express();

app.set('query parser', 'simple');
app.set('case sensitive routing', true);
app.set('jsonp callback name', 'callback');
app.set('strict routing', true);
app.set('trust proxy', true);

app.disable('x-powered-by');

// 记录请求日志
app.use(morgan('tiny'));

app.use(express.static(path.join(__dirname, 'public')));

// parse `application/x-www-form-urlencoded`
app.use(bodyParser.urlencoded({ extended: true }));

// parse `application/json`
app.use(bodyParser.json());

app.use('/', require('./routes'));
app.use('/info', info);

// 打印异常日志
process.on('uncaughtException', error => {
    console.log(error);
});

// 启动server
http.createServer(app).listen(config.port, () => {
    console.log('Express server listening on port: %s', config.port);
});

// setInterval(() => {
//     var pool = _dao.getPool();
//     console.log('interval connect oracle begin');
//     pool.getConnection(function (err, connection) {
//         console.log('interval connect oracle end');
//         connection.release();
//     })
// }, 60 * 1000)