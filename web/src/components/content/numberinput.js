import React from 'react';
import styles from './numberinput.less';
import QueueAnim from 'rc-queue-anim';
import Inkbutton from '../common/inkbutton';
import Store from '../../flux/stores/Store';
var StoreEvent = require('../../flux/event-const').StoreEvent;
import Action from '../../flux/actions/Actions';
import { Icon } from 'antd'


class Numberinput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numbervalue: '411-MH011707030001',
      resultlist: Store.getNumberList()
    };
    this.onNumberChange = this.onNumberChange.bind(this);
    this.onClickResult = this.onClickResult.bind(this);
    this.onClickQuery = this.onClickQuery.bind(this);
    this.onNumberlistChange = this.onNumberlistChange.bind(this);
    this.lastvaluelength = 0;
  }
  componentDidMount() {
    var context = this;
    setTimeout(function () {
      context.refs.numberinput.focus();
    }, 500);

    Store.addChangeListener(StoreEvent.SE_NUMBERLIST,this.onNumberlistChange);

    Store.setNumberList([]);
  }
  componentWillUnmount(){
    Store.removeChangeListener(StoreEvent.SE_NUMBERLIST,this.onNumberlistChange);
  }

  onClickQuery(){
    var numbervalue = this.refs.numberinput.value;
    Action.query(numbervalue);
  }

  onNumberlistChange(){
    this.setState({
      resultlist: Store.getNumberList()
    })
  }

  onNumberChange(e) {
    console.log(e.target.value);
    if (e.target.value.length == 14 && this.lastvaluelength == 13) {
      Action.query(e.target.value);
    }
    if (e.target.value.length == 18) {
      Action.query(e.target.value);
    }

    if (e.target.value.length > 18) {
      return;
    }
    if (e.target.value.length == 3 && this.lastvaluelength == 2) {
      e.target.value += '-MH';
    }
    this.setState({
      numbervalue: e.target.value
    })

    this.lastvaluelength = e.target.value.length;
  }

  onClickResult(e){
    Store.setCurNumber(e.target.dataset.numberinfo);
  }

  getResultDom() {
    var context = this;
    return this.state.resultlist.map((result) => {
      return <div key={result} data-numberinfo={result} onClick={context.onClickResult} className={styles.resultpanel}>{result}
          </div>
    })
  }

  render() {
    return (
      <div className={styles.container}>
        <QueueAnim type="bottom">
          <div key="numbercontainer" className={styles.numbercontainer}>
            <input onChange={this.onNumberChange} value={this.state.numbervalue}
              className={styles.numberinput} ref="numberinput" placeholder="请输入18位工单单号" type="text" />
            <Inkbutton id="searchbtn" clickfun={this.onClickQuery} stylename={styles.searchbtn} value={<Icon type='search' />} />
          </div>
        </QueueAnim>
        <div className={styles.resultcontainer}>
          <QueueAnim type="bottom">
            {this.getResultDom()}
          </QueueAnim>
        </div>
      </div>
    );
  }
}

export default Numberinput;
