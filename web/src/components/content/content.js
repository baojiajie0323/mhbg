import React from 'react';
import styles from './content.less';
import QueueAnim from 'rc-queue-anim';
import Inkbutton from '../common/inkbutton';
import Store from '../../flux/stores/Store';
var StoreEvent = require('../../flux/event-const').StoreEvent;
import Action from '../../flux/actions/Actions';
import NumberInput from './numberinput';
import Detail from './detail';

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curNumber: ''
    };
    this.onEnterDetail = this.onEnterDetail.bind(this);
  }
  componentDidMount() {
    Store.addChangeListener(StoreEvent.SE_NUMBER,this.onEnterDetail);
    // Store.setNumberList([
    //   {
    //         number:1,
    //         index: 2,
    //         code:'CHILDJDYH1-24-0102003',
    //         name:'彩印塑封袋-巧資加大印花护洗袋'
    //       },
    //       {
    //         number:1,
    //         index: 4,
    //         code:'CHILDJDYH1-25-0102004',
    //         name:'彩印塑封袋-巧資加小印花护洗袋'
    //       },
    //       {
    //         number:1,
    //         index: 5,
    //         code:'CHILDJDYH1-25-0102004',
    //         name:'彩印塑封袋-巧資加小印花护洗袋'
    //       },
    //       {
    //         number:1,
    //         index: 6,
    //         code:'CHILDJDYH1-25-0102004',
    //         name:'彩印塑封袋-巧資加小印花护洗袋'
    //       },
    //       {
    //         number:1,
    //         index: 7,
    //         code:'CHILDJDYH4-27-0102004',
    //         name:'彩印塑封袋-巧資加小印花护洗袋'
    //       }])
  }
  componentWillUnMount(){
    Store.removeChangeListener(StoreEvent.SE_NUMBER,this.onEnterDetail);
  }

  onEnterDetail() {
    this.setState({ curNumber:Store.getCurNumber() })
  }

  render() {
    return (
      <div className={styles.container}>
        {this.state.curNumber != "" ?
          <NumberInput onEnter={this.onEnterDetail} /> :  
          <Detail curNumber={this.state.curNumber} />
        }
      </div>
    );
  }
} 

export default Content;
