import React from 'react';
import styles from './login.less';
import InkButton from '../common/inkbutton';
import Store from '../../flux/stores/Store';
var StoreEvent = require('../../flux/event-const').StoreEvent;
import Action from '../../flux/actions/Actions';
import {message} from 'antd';
import $ from 'jquery';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.onClickLoginbtn = this.onClickLoginbtn.bind(this);
  }
  componentDidMount() {
    var victor = new Victor("logincontainer", "loginbk");

    var localuser = localStorage.username;
    var localpwd = localStorage.password;
    if(localuser != undefined){
      this.refs.user.value = localuser;
    }
    if(localpwd != undefined){
      this.refs.pwd.value = localpwd;
    }
  }

  onClickLoginbtn(){
    var username = this.refs.user.value;
    var password = this.refs.pwd.value;
    if(password.length < 6){
      message.error("密码长度为6位");
      return;
    }
    Action.login(username,password);
    localStorage.username = username;
    localStorage.password = password;
  }
  render() {
    return (
      <div id="logincontainer" className={styles.container}>
        <div id="loginbk"></div>
        <div className={styles.systitle}>欢迎使用智能验收称重系统</div>
        <div className={styles.loginpanel}>
          <input className={styles.userinput} ref='user' type='text' placeholder='请输入用户名' />
          <input className={styles.userinput} ref='pwd' type='password' placeholder='请输入密码' />
          <InkButton id="loginbtn" stylename={styles.loginbtn} clickfun={this.onClickLoginbtn} value="登录" />
        </div>
      </div>
    );
  }
}

export default Login;
