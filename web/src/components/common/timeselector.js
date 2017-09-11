import React from 'react';
import styles from './timeselector.less';
import QueueAnim from 'rc-queue-anim';
import $ from 'jquery';
import IScroll from 'iscroll';
class timeselector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this._scroller_l = null;
    this._scroller_r = null;
    this.onClickOk = this.onClickOk.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);

    this.hourlist = ['','','00','01','02','03','04','05','06','07','08','09',10,11,12,13,14,15,16,17,18,19,20,21,22,23,'',''];
    this.minutelist = ['','','00','05',10,15,20,25,30,35,40,45,50,55,'',''];

  }
  componentDidMount(){
    this.init_left();
    this.init_right();

    var defaultTime = this.props.defalutTime.split(':');
    var defaultHour = parseInt(defaultTime[0]);
    var defaultMinute = parseInt(defaultTime[1]) / 5;

    this._scroller_l.goToPage(0,defaultHour);
    this._scroller_r.goToPage(0,defaultMinute);
  }
  componentWillUnmount(){
  }
  onClickOk(){
    var currentPage_hour = this._scroller_l.currentPage.pageY;
    var currentPage_minute = this._scroller_r.currentPage.pageY;
    if(this.props.timeChangecb){
      this.props.timeChangecb(this.hourlist[currentPage_hour + 2] + ':' + this.minutelist[currentPage_minute + 2]);
    }
  }
  onClickCancel(){
    if(this.props.timeChangecb){
      this.props.timeChangecb(this.props.defalutTime);
    }
  }

  init_left() {
    if (this._scroller_l) {
      this._scroller_l.refresh();
      return;
    }
    this._scroller_l = new IScroll('#timeselector_left', {
      mouseWheel: true,
      scrollbars: false,
      tap: true,
      snap: 'li',
    });


  }
  init_right() {
    if (this._scroller_r) {
      this._scroller_r.refresh();
      return;
    }
    this._scroller_r = new IScroll('#timeselector_right', {
      mouseWheel: true,
      scrollbars: false,
      tap: true,
      snap: 'li',
    });
  }
  getHourDom(){
    var hourDom = [];

    this.hourlist.forEach((hour) =>{
      if(hour !== ""){
        hourDom.push(<li className={styles.li_left}>{hour + '时'}</li>);
      }else{
        hourDom.push(<li className={styles.li_left}></li>);
      }
    })

    return hourDom;

  }
  getMinuteDom(){
    var MinuteDom = [];

    this.minutelist.forEach((minute) =>{
      if(minute !== ""){
        MinuteDom.push(<li className={styles.li_right}>{minute + '分'}</li>);
      }else{
        MinuteDom.push(<li className={styles.li_right}></li>);
      }
    })
    return MinuteDom;
  }
  render() {
    return (
      <div className={styles.timeselector} >
         <div className={styles.selectorconfirm}>
          <p onClick={this.onClickOk}>确定</p>
          <p onClick={this.onClickCancel}>取消</p>
         </div>
         <div className={styles.selectcontainer}>
           <div className={styles.selectmask}></div>
           <div className={styles.timeselector_left} id="timeselector_left">
             <div className={styles.scroller}>
               <ul>
                {this.getHourDom()}
               </ul>
             </div>
           </div>
           <div className={styles.timeselector_right} id="timeselector_right">
             <div className={styles.scroller}>
               <ul>
                 {this.getMinuteDom()}
               </ul>
             </div>
           </div>
           <div className={styles.line_top}></div>
           <div className={styles.line_bottom}></div>
         </div>
      </div>
    );
  }
}

export default timeselector;
