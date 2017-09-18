import React from 'react';
import styles from './content.less';
import QueueAnim from 'rc-queue-anim';
import Store from '../../flux/stores/Store';
var StoreEvent = require('../../flux/event-const').StoreEvent;
import Action from '../../flux/actions/Actions';
import { Icon, Button, Table, Input, DatePicker } from 'antd'
import moment from 'moment';
const { RangePicker } = DatePicker;
class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: [],
      curOrder: null,
      orderDetail: [],
      //showBack:false,
    };
    this.onChangeOrder = this.onChangeOrder.bind(this);
    this.onChangeOrderDetail = this.onChangeOrderDetail.bind(this);
    this.onClickQuery = this.onClickQuery.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    // this.onMouseEnter = this.onMouseEnter.bind(this);
    // this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClickBack = this.onClickBack.bind(this);
    this.queryData = [moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")];
  }
  componentDidMount() {
    Store.addChangeListener(StoreEvent.SE_ORDER, this.onChangeOrder);
    Store.addChangeListener(StoreEvent.SE_ORDER_DETAIL, this.onChangeOrderDetail);
  }
  componentWillUnMount() {
    Store.removeChangeListener(StoreEvent.SE_ORDER, this.onChangeOrder);
    Store.removeChangeListener(StoreEvent.SE_ORDER_DETAIL, this.onChangeOrderDetail);
  }
  // onMouseEnter(){
  //   this.setState({showBack:true})
  // }
  // onMouseLeave(){
  //   this.setState({showBack:false})
  // }
  onChangeOrder(order) {
    this.setState({
      order
    })
  }
  onChangeOrderDetail(orderDetail) {
    this.setState({
      orderDetail
    })
  }
  onClickPrint(order) {
    this.setState({
      curOrder: order
    }, function () {
      JsBarcode("#barcode", order.TC_AFR02, {
        width: 1,
        height: 50,
        fontSize: 14
      });
    })
    Action.getOrderDetail({
      order: order.TC_AFR02
    });
  }
  onClickBack() {
    this.setState({
      curOrder: null,
      orderDetail: []
    })
  }
  onClickPrintView() {
    window.print();
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
    var context = this;
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
        <a onClick={function () { context.onClickPrint(record) }}>打印</a>
      )
    }]
  }
  getTableData() {
    return this.state.order;
  }
  getTableDetailColumns() {
    return [{
      title: '项次',
      dataIndex: 'TC_AFR02',
      key: 'TC_AFR02',
    }, {
      title: '发料料号',
      dataIndex: 'GDTYPE',
      key: 'GDTYPE',
    }, {
      title: '品名',
      dataIndex: 'SFB81',
      key: 'SFB81',
    }, {
      title: '单位',
      dataIndex: 'TC_AFR09',
      key: 'TC_AFR09',
    }, {
      title: '应发量',
      dataIndex: 'IMA02',
      key: 'IMA02',
    }, {
      title: '已发量',
      dataIndex: 'SFB08',
      key: 'SFB08',
    }, {
      title: '欠料量',
      dataIndex: 'SFB081',
      key: 'SFB081',
    }]
  }
  getTableDetailData() {
    return this.state.orderDetail;
  }
  render() {
    const dateFormat = 'YYYY-MM-DD';
    var { curOrder, showBack } = this.state;
    return (
      <div className={styles.container}>
        {curOrder && <div onClick={this.onClickBack} className={styles.backbtn}>返回</div>}
        {curOrder && <div onClick={this.onClickPrintView} className={styles.printbtn}>打印</div>}
        {curOrder ? <div className={styles.order}>
          <p className={styles.orderTitle}>工单生产任务单</p>
          <img className={styles.barcode} id="barcode" />
          <div className={styles.orderForm}>
            <div className={styles.content}>
              <p>工单类型：</p>
              <p>{curOrder.GDTYPE}</p>
            </div>
            <div className={styles.content}>
              <p>生产负责人：</p>
              <p>{curOrder.GEN02}</p>
            </div>
            <div className={styles.content}>
              <p>工单状态：</p>
              <p>{curOrder.GDSTATUS}</p>
            </div>
          </div>
          <div className={styles.orderForm}>
            <div className={styles.content}>
              <p>开单日期：</p>
              <p>{curOrder.SFB81}</p>
            </div>
            <div className={styles.content}>
              <p>预计开工：</p>
              <p>2017-09-16</p>
            </div>
            <div className={styles.content}>
              <p>预计完工：</p>
              <p>2017-09-16</p>
            </div>
          </div>
          <div className={styles.orderForm}>
            <div className={styles.content2}>
              <p>产品编号：</p>
              <p>{curOrder.TC_AFR09}</p>
            </div>
            <div className={styles.content2}>
              <p>品名：</p>
              <p>{curOrder.IMA02}</p>
            </div>
          </div>
          <div className={styles.orderForm}>
            <div className={styles.content}>
              <p>生产数量：</p>
              <p>{curOrder.SFB08}</p>
            </div>
            <div className={styles.content}>
              <p>已发数量：</p>
              <p>{curOrder.SFB081}</p>
            </div>
          </div>
          <div className={styles.detailtable}>
            <Table bordered={true} dataSource={this.getTableDetailData()} columns={this.getTableDetailColumns()} />
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
