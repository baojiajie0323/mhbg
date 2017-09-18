import React from 'react';
import styles from './content.less';
import QueueAnim from 'rc-queue-anim';
import Inkbutton from '../common/inkbutton';
import Store from '../../flux/stores/Store';
var StoreEvent = require('../../flux/event-const').StoreEvent;
import Action from '../../flux/actions/Actions';
import NumberInput from './numberinput';
import Detail from './detail';
import { Icon, Button, Table, Input, DatePicker } from 'antd'
import moment from 'moment';
const { RangePicker } = DatePicker;
class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: [],
      curOrder: '331-MH112233445566'
    };
    this.onChangeOrder = this.onChangeOrder.bind(this);
    this.onClickQuery = this.onClickQuery.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.queryData = [moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")];
  }
  componentDidMount() {
    Store.addChangeListener(StoreEvent.SE_ORDER, this.onChangeOrder);
    JsBarcode("#barcode", this.state.curOrder , {
      width: 1,
      height: 50,
      fontSize: 14
    });
  }
  componentWillUnMount() {
    Store.removeChangeListener(StoreEvent.SE_ORDER, this.onChangeOrder);
  }
  onChangeOrder(order) {
    this.setState({
      order
    })
  }
  onDateChange(date, dateString) {
    this.queryData = dateString;
    console.log("onDateChange", date, dateString);
  }
  onClickQuery() {
    console.log("onClickQuery", this.c);
    var queryData = {
      beginDate: this.queryData[0],
      endDate: this.queryData[1],
      orderno: this.c.refs.input.value
    }
    Action.getOrder(queryData);
  }
  getTableColumns() {
    return [{
      title: '工单单号',
      dataIndex: 'TC_AFR02',
      key: 'TC_AFR02',
    }, {
      title: '工单类型',
      dataIndex: 'GDTYPE',
      key: 'GDTYPE',
    }, {
      title: '开单日期',
      dataIndex: 'SFB81',
      key: 'SFB81',
    }, {
      title: '产品编号',
      dataIndex: 'TC_AFR09',
      key: 'TC_AFR09',
    }, {
      title: '品名',
      dataIndex: 'IMA02',
      key: 'IMA02',
    }, {
      title: '生产数量',
      dataIndex: 'SFB08',
      key: 'SFB08',
    }, {
      title: '已发数量',
      dataIndex: 'SFB081',
      key: 'SFB081',
    }, {
      title: '完工数量',
      dataIndex: 'SFB09',
      key: 'SFB09',
    }, {
      title: '工单状态',
      dataIndex: 'GDSTATUS',
      key: 'GDSTATUS',
    }, {
      title: '工艺',
      dataIndex: 'TC_AFR05',
      key: 'TC_AFR05',
    }, {
      title: '线别',
      dataIndex: 'TC_AFR07',
      key: 'TC_AFR07',
    }, {
      title: '负责人',
      dataIndex: 'GEN02',
      key: 'GEN02',
    }, {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (text, record) => (
        <a>打印</a>
      )
    }]
  }
  getTableData() {
    return this.state.order;
  }
  render() {
    const dateFormat = 'YYYY-MM-DD';
    return (
      <div className={styles.container}>
        {this.state.curOrder ? <div className={styles.order}>
          <p className={styles.orderTitle}>工单生产任务单</p>
          <img className={styles.barcode} id="barcode"/>
          <div className={styles.orderForm}>

          </div>
          <div className={styles.orderForm}>
            
          </div>
          <div className={styles.orderForm}>
            
          </div>
          <div className={styles.orderForm}>
            
          </div>
        </div>
        : <div>
          <div className={styles.search}>
            <p>请选择日期：</p>
            <RangePicker
              defaultValue={[moment(), moment()]}
              format={dateFormat}
              onChange={this.onDateChange}
            />
            <Input ref={(c) => this.c = c} style={{ margin: '0 15px', width: '200px' }} placeholder="请输入工单号" />
            <Button onClick={this.onClickQuery} type="primary" icon="search">查询</Button>
          </div>
          <div className={styles.searchresult}>
            <Table dataSource={this.getTableData()} columns={this.getTableColumns()} />
          </div>
        </div>
        }
        {/*this.state.curNumber != "" ?
          <NumberInput onEnter={this.onEnterDetail} /> :  
          <Detail curNumber={this.state.curNumber} />
        */}
      </div>
    );
  }
}

export default Content;
