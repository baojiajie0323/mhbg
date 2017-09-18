import React from 'react';
import Header from './header/header';
import Content from './content/content';
import Login from './login/login';
import styles from './App.less';
import $ from 'jquery';
import { message, Modal } from 'antd';
const confirm = Modal.confirm;
var Store = require("../flux/stores/Store");
var StoreEvent = require("../flux/event-const").StoreEvent;
var Action = require("../flux/actions/Actions");


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginsuccess: true,
    };

    this.onLoginChange = this.onLoginChange.bind(this);
  }

  componentWillUnMount() {
    Store.removeChangeListener(StoreEvent.SE_LOGIN, this.onLoginChange);
  }
  componentDidMount() {
    // setTimeout(function () {
    //   document.getElementById('firstload').style.opacity = 0;
    //   document.getElementById('root').style.opacity = 1;
    // }, 500)

    Store.addChangeListener(StoreEvent.SE_LOGIN, this.onLoginChange);
    //Action.init();
  }

  onLoginChange() {
    this.setState({
      loginsuccess: Store.getLoginsuccess()
    })
  }

  render() {

    return (
      <div className={styles.container}>
        {/*<Header />*/}
        {this.state.loginsuccess ?
          <Content /> :
          <Login />}
      </div>
    );
  }
}

export default App;
