import React from 'react';
import styles from './detail.less';
import QueueAnim from 'rc-queue-anim';
import Inkbutton from '../common/inkbutton';
import Store from '../../flux/stores/Store';
var StoreEvent = require('../../flux/event-const').StoreEvent;
import Action from '../../flux/actions/Actions';
import { Modal, message, Popconfirm, Table } from 'antd';
const confirm = Modal.confirm;

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weightvisible: false,
      jxcount: 0,
      weight: 0,
      weightInfo: '',
      weightList:[],
    };
    this.onClickSubmit = this.onClickSubmit.bind(this);
    this.onClickWeight = this.onClickWeight.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onjxCountChange = this.onjxCountChange.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.onSerialChange = this.onSerialChange.bind(this);
    this.onClickLeave = this.onClickLeave.bind(this);
  }
  componentDidMount() {
    Store.addChangeListener(StoreEvent.SE_SERIAL, this.onSerialChange);
  }
  componentWillUnmount() {
    Store.removeChangeListener(StoreEvent.SE_SERIAL, this.onSerialChange);
  }

  onSerialChange(serialData) {
    //if (this.refs.startNumber) {
      // console.log(serialData);
      // var startNumber = parseInt(this.refs.startNumber.value);
      // console.log('startNumber', startNumber);
      // var ratio = parseFloat(this.refs.ratio.value);
      // console.log('ratio', ratio);
      // var weight = (parseInt(serialData) - startNumber) * ratio;
      // console.log('weight', weight);

      var weightInfo = parseFloat(serialData).toFixed(1);
      this.setState({
        weight: weightInfo,
        weightInfo: weightInfo
      })
    //}

  }

  onClickLeave() {
    Store.setCurNumber('');
  }

  onClickSubmit() {
    var context = this;
    confirm({
      title: '确定要提交单据吗？',
      content: '请确保所有项次都完成称重',
      onOk() {
        //var numberInfoList = Store.getNumberInfoByNumber(context.props.curNumber);
        Action.update(context.state.weightList);
        message.success('单据提交成功');
        Store.setCurNumber('');
      },
      onCancel() {
      },
    });
  }
  onjxCountChange(e) {
    this.setState({
      jxcount: e.target.value
    })
  }

  onClickWeight(record) {
    this.code = record.ljno;
    this.index = this.getProductIndex(record);
    this.setState({
      weightvisible: true,
      jxcount: this.index,
      weight: 0
    })
  }

  getProductIndex(record){
    var count = 1;
    var weightList = this.state.weightList;
    for (var i = 0; i < weightList.length; i++) {
      if(weightList[i].code == record.ljno){
          count = weightList[i].count + 1;
        }
    }
    return count;
  }

  onClickDelete(record) {
    var weightList = this.state.weightList;
    for (var i = 0; i < weightList.length; i++) {
      if(weightList[i].code == record.code &&
        weightList[i].count == record.count){
          weightList.splice(i,1);
          break;
        }
    }
    this.setState({weightList});
  }

  handleCancel() {
    this.setState({
      weightvisible: false
    })
  }
  handleOk() {
    //localStorage.startNumber = parseInt(this.refs.startNumber.value);
    //localStorage.ratio = parseFloat(this.refs.ratio.value);
    var count = this.index;
    this.add2weightList(count,parseFloat(this.state.weight));
    //Store.setNumberInfo(this.props.curNumber, this.index, this.code, count, parseFloat(this.state.weight));
    this.setState({
      weightvisible: false
    })
  }

  getProduct(){
      var numberInfoList = Store.getNumberInfoByNumber(this.props.curNumber);
      for (var i = 0; i < numberInfoList.length; i++) {
        if(numberInfoList[i].code == this.code){
          return numberInfoList[i];
        }
      }
      return null;
  }

  add2weightList(count,weight){
      var product = this.getProduct();
      if(product){
        var weightList = this.state.weightList;
        weightList.push({
          number: product.number,
          code:product.code,
          index:product.index,
          name:product.name,
          count:count,
          weight:weight
        })

        this.setState({
          weightList:weightList
        })
      }
  }

  getTableColumn() {
    var context = this;
    const columns = [{
    //   title: '项次',
    //   dataIndex: 'index',
    //   key: 'index',
    // }, {
      title: '料件编号',
      dataIndex: 'ljno',
      key: 'ljno',
    }, {
      title: '品名规格',
      dataIndex: 'name',
      key: 'name',
    }, {
    //   title: '卷芯个数',
    //   dataIndex: 'count',
    //   key: 'count',
    // }, {
    //   title: '实际重量',
    //   dataIndex: 'weight',
    //   key: 'weight',
    // }, {
      title: '操作',
      key: 'operate',
      render: function (text, record, index) {
        return <a onClick={function () { context.onClickWeight(record) } } href="#">称重</a>
      }
    }];

    return columns;
  }

  getTableDataSource() {
    var numberInfoList = Store.getNumberInfoByNumber(this.props.curNumber);
    const dataSource = numberInfoList.map((info, index) => {
      return {
        key: index.toString(),
        ljno: info.code,
        name: info.name,
      }
    })
    return dataSource;
  }

  getTableRstColumn() {
    var context = this;
    const columns = [{
      title: '料件编号',
      dataIndex: 'code',
      key: 'code',
    }, {
      title: '品名规格',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '卷次',
      dataIndex: 'count',
      key: 'count',
    }, {
      title: '实际重量',
      dataIndex: 'weight',
      key: 'weight',
    }, {
      title: '操作',
      key: 'operate',
      render: function (text, record, index) {
        return <Popconfirm key="userpanel" title="确定要删除这条数据吗?" onConfirm={function () { context.onClickDelete(record) } } okText="确定" cancelText="取消">
          <a href="#">删除</a>
        </Popconfirm>
      }
    }];

    return columns;
  }

  getTableDataRstSource() {
    var weightList = this.state.weightList;
    const dataSource = weightList.map((info, index) => {
      return {
        key: index.toString(),
        code: info.code,
        name: info.name,
        count: info.count,
        weight: info.weight + '公斤'
      }
    })
    return dataSource;
  }

  render() {
    return (
      <div className={styles.container}>
        <QueueAnim component='div' className={styles.detailcontainer}>
          <p key='detailtitle' className={styles.detailtitle}>采购收货作业验收单</p>
          <p key='detailnumber' className={styles.detailnumber}>验收单号：<span>{this.props.curNumber}</span></p>
          <Inkbutton key='leavebtn' id="leavebtn" clickfun={this.onClickLeave} stylename={styles.leavebtn} value='' />
          <div className={styles.detaillist}>
            <div className={styles.topTable}>
              <Table pagination={false} dataSource={this.getTableDataSource()} columns={this.getTableColumn()} />
            </div>
            <div className={styles.bottomTable}>
              <p>称重记录</p>
              <Table size="small" pagination={false} dataSource={this.getTableDataRstSource()} columns={this.getTableRstColumn()} />
            </div>
          </div>
          <Inkbutton key='submitbtn' id="submitbtn" clickfun={this.onClickSubmit} stylename={styles.submitbtn} value='提交单据' />
        </QueueAnim>
        <Modal title="料件称重" visible={this.state.weightvisible}
          onOk={this.handleOk} onCancel={this.handleCancel}
          >
          <div className={styles.weightpanel}>
            <span>实际重量： </span><span className={styles.weighttext}>{this.state.weightInfo}</span><span>公斤</span>
          </div>
          <div className={styles.countpanel}>
            卷次： <input ref="jxcount" disabled="disabled" onChange={this.onjxCountChange} className={styles.countinput} value={this.state.jxcount} type='number' />
          </div>
        </Modal>
      </div>
    );
  }
}

export default Detail;
