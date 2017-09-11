import React from 'react';
import styles from './header.less';
import InkButton from '../common/inkbutton';
import QueueAnim from 'rc-queue-anim';
import { Modal, Message ,Popconfirm,Icon } from 'antd';
const confirm = Modal.confirm;
import Store from '../../flux/stores/Store';
var StoreEvent = require('../../flux/event-const').StoreEvent;
import Action from '../../flux/actions/Actions';

var BrowserWindow = null;
var app = null;
if (window.require != undefined) {
  var remote = window.require('remote');
  BrowserWindow = remote.getCurrentWindow();
}

import $ from 'jquery';
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.onClickClosebtn = this.onClickClosebtn.bind(this);
    this.onClickMinbtn = this.onClickMinbtn.bind(this);
  }
  componentDidMount() {
  }
  onClickClosebtn() {
    this.onClickQuit()
  }
  onClickMinbtn() {
    let remote = window.require('remote');
    let app = remote.require('app');
    app.emit('min');
  }
  onClickQuit() {
    this.quitRequire('确认要关闭程序吗？');
  }
  onClickLogout(){
    Action.logout();
  }
  quitRequire(title, content) {
    confirm({
      title: title,
      content: content,
      onOk() {
        //Action.logout();
        let remote = window.require('remote');
        let app = remote.require('app');
        app.emit('logoff');
      },
      onCancel() {
      },
    });
  }
  render() {
    //页面加载完毕
    var loginsuccess = Store.getLoginsuccess();
    return (
      <div className={styles.container}>
        <QueueAnim component='div' className={styles.userpanel} type="top" >
          {loginsuccess ?
            <Popconfirm key="userpanel" title="确定要注销吗?" onConfirm={this.onClickLogout} okText="确定" cancelText="取消">
              <div className={styles.usertext}>
                <p>欢迎登录</p>
                <p>你好，<span>{localStorage.username}</span></p>
              </div>
            </Popconfirm> : null
          }
        </QueueAnim>
        <InkButton id="closebtn" stylename={styles.closebtn} clickfun={this.onClickClosebtn} value="" />
        <InkButton id="minbtn" stylename={styles.minbtn} clickfun={this.onClickMinbtn} value="" />
        <div className={styles.companyName}>上海满好日用品有限公司</div>
        <div className={styles.companyName_EN}>Shanghai Myhome Daily Household Product Co.,Ltd.</div>
      </div>
    );
  }
}

export default Header;
