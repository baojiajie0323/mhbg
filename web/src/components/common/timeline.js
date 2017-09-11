import React from 'react'
import TimelineUtil from './timeline-util'
import styles from './timeline.less'
import objectAssign from 'object-assign'

class ActionStatus {
  constructor() {
    this.shifting = false
    this.animating = false
    this.speed = null

    this.originMouseInfo = null
    this.oldMouseInfo = null
    this.mouseInfo = null
  }

  setMouseInfo(e) {
    this.oldMouseInfo = this.mouseInfo;
    this.mouseInfo = TimelineUtil.getMouseInfo(e);
    return this.oldMouseInfo;
  }

  isMoveLeft() {
    if (this.mouseInfo.x === this.originMouseInfo.x) {
      return this.mouseInfo.y < this.originMouseInfo.y;
    } else {
      return this.mouseInfo.x < this.originMouseInfo.x;
    }
  }

  calcSpeed(old) {
    if (!old || this.mouseInfo.timeStamp === old.timeStamp) {
      this.speed = null;
      return 0;
    } else {
      var distance = Math.max(TimelineUtil.calcDistance(this.mouseInfo, old), 1);
      var speed = distance * 10 / Math.abs(this.mouseInfo.timeStamp - old.timeStamp);

      var sign = this.isMoveLeft() ? 1 : -1;
      this.speed = parseInt(speed * sign);

      return this.speed;
    }
  }

  decSpeed() {
    if (!this.speed) return 0;

    var speed = parseInt(this.speed * 0.8);
    if (Math.abs(speed) === 0) {
      this.speed = null;
      return 0;
    } else {
      this.speed = speed;
      return speed;
    }
  }
}

export default class TimeLine extends React.Component {
  static SpanSetting = {
    '15m': {
      totalTime: 900000,  // 总时长
      unitTime: 300000,   // 主刻度间隔
      subTicks: 5,        // 辅刻度个数
      minorTicks: 2       // 小刻度个数
    },
    '30m': {
      totalTime: 1800000,
      unitTime: 600000,
      subTicks: 2,
      minorTicks: 5
    },
    '1h': {
      totalTime: 3600000,
      unitTime: 1200000,
      subTicks: 2,
      minorTicks: 5
    },
    '2h': {
      totalTime: 7200000,
      unitTime: 1800000,
      subTicks: 3,
      minorTicks: 5
    },
    '4h': {
      totalTime: 14400000,
      unitTime: 3600000,
      subTicks: 4,
      minorTicks: 5
    },
    '6h': {
      totalTime: 21600000,
      unitTime: 7200000,
      subTicks: 4,
      minorTicks: 6
    },
    '12h': {
      totalTime: 43200000,
      unitTime: 10800000,
      subTicks: 3,
      minorTicks: 4
    },
    '24h': {
      totalTime: 86400000,
      unitTime: 14400000,
      subTicks: 4,
      minorTicks: 4
    },
  }

  constructor(props) {
    super(props);

    this.initStartTime();

    this.state = {
      //startTime: curDate,
      //span: '1h',
    };

    this.actionStatus = new ActionStatus();

    this.handleResize       = this.handleResize.bind(this);
    this.handleTouchStart   = this.handleTouchStart.bind(this);
    this.handleTouchMove    = this.handleTouchMove.bind(this);
    this.handleTouchEnd     = this.handleTouchEnd.bind(this);
    this.handleTouchCancel  = this.handleTouchCancel.bind(this);
    this.handleClick        = this.handleClick.bind(this);
    this.handleDoubleClick  = this.handleDoubleClick.bind(this);
    this.handleMouseDown    = this.handleMouseDown.bind(this);
    this.handleMouseMove    = this.handleMouseMove.bind(this);
    this.handleMouseUp      = this.handleMouseUp.bind(this);
    this.handleMouseLeave   = this.handleMouseLeave.bind(this);
    this.handleMouseEnter   = this.handleMouseEnter.bind(this);
    this.handleMouseOut     = this.handleMouseOut.bind(this);
    this.handleMouseOver    = this.handleMouseOver.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)

    this.handleResize()
  }

  componentWillReceiveProps(nextProps) {
    if (!this.actionStatus.shifting && nextProps.startTime) {
      this.setStartTime(nextProps.startTime);
    }

    this.tickShifting();
  }

  // setSpan(span) {
  //   if (this.state.span !== span) {
  //     this.setState({
  //       span
  //     }, () => {
  //       this.tickShifting()
  //     })
  //   }
  // }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  startAnimation() {
    const self = this;

    if (self.actionStatus.animating) {
      self.tickAnimation();
    } else if (self.actionStatus.shifting) {
      self.tickShifting();
    }
  }

  cancelAnimation() {
  }

  tickShifting() {
    requestAnimationFrame(() => {
      this.draw();
    })
  }

  tickAnimation(timestamp) {
    const self = this;

    function anim() {
      if (!self.actionStatus.animating) return;

      const spanSetting = self.getSpanSetting();
      const speed = self.actionStatus.decSpeed();
      if (speed === 0) {
        self.actionStatus.animating = false;

        if(!self.actionStatus.shifting && self.props.onTimeChangecb){
          self.props.onTimeChangecb(
            self.getStartTime(), self.getIndicatorTime());
        }
        return;
      }

      self.shift(Math.abs(speed * 5), speed > 0);
      requestAnimationFrame(anim);
    }

    anim();
  }

  draw() {
    this.drawTicks()
    this.drawBkg()
    this.drawMain()
    this.drawIndicator()
  }

  getTickStyle() {
    let tickStyle = {
      font: '12px 微软雅黑',
      textAlign: 'center',
      textBaseline: 'top',
      textColor: 'rgb(49, 89, 154)',
      mainHeight: 19,
      mainWidth: 2,
      mainColor: 'rgb(49, 89, 154)',
      subHeight: 17,
      subWidth: 1,
      subColor: 'rgb(49, 89, 154)',
      minorHeight: 9,
      minorWidth: 1,
      minorColor: 'rgb(42, 89, 83)'
    }

    objectAssign(tickStyle, this.props.tickStyle)

    return tickStyle
  }

  drawTicks() {
    const canvas = this._canvasTicks
    if (!canvas) return

    const width = canvas.width
    const height = canvas.height
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, width, height)
    ctx.save()

    const spanSetting = this.getSpanSetting()
    const subUnit = spanSetting.unitTime / spanSetting.subTicks
    const minorUnit = subUnit / spanSetting.minorTicks
    const start = this.getStartTime()
    const end = this.getEndTime()

    const times = TimelineUtil.getTicks(
      start, end, spanSetting.unitTime, subUnit, minorUnit)

    const tickStyle = this.getTickStyle()

    ctx.font = tickStyle.font
    ctx.textAlign = tickStyle.textAlign
    ctx.textBaseline = tickStyle.textBaseline

    var context = this;
    times.forEach( function(t){
      const strTime = TimelineUtil.getTimeString(t.time, 'hh:mm')
      let timeX = context.timeToX(t.time)

      let lineHeight = 19
      let lineWidth = 1
      let lineColor = 'rgb(49, 89, 154)'
      let drawText = false
      if (t.type === 'main') {
        lineHeight = tickStyle.mainHeight
        lineWidth = tickStyle.mainWidth
        lineColor = tickStyle.mainColor
        drawText = true
      } else if (t.type === 'sub') {
        lineHeight = tickStyle.subHeight
        lineWidth = tickStyle.subWidth
        lineColor = tickStyle.subColor
      } else if (t.type === 'minor') {
        lineHeight = tickStyle.minorHeight
        lineWidth = tickStyle.minorWidth
        lineColor = tickStyle.minorColor
      }

      ctx.beginPath()
      ctx.moveTo(timeX, height - 1)
      ctx.lineTo(timeX, height - 1 - lineHeight)
      ctx.strokeStyle = lineColor
      ctx.lineWidth = lineWidth
      ctx.stroke()

      if (drawText) {
        const textWidth = ctx.measureText(strTime).width
        if (timeX - textWidth / 2 < 0) {
          timeX = textWidth / 2
        } else if (timeX + textWidth / 2 > width) {
          timeX = width - textWidth / 2
        }

        ctx.beginPath()
        ctx.fillStyle = tickStyle.textColor
        ctx.fillText(strTime, timeX, 0)
      }
    })

    ctx.restore()
  }

  drawBkg() {
    const canvas = this._canvasBkg
    if (!canvas) return

    const width = canvas.width
    const height = canvas.height
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, width, height)
    ctx.save()

    const maskWidth = 200;
    const maskHeight = 14;
    const maskleft = (width - maskWidth) / 2;
    var my_gradient = ctx.createLinearGradient(maskleft,0,maskleft+maskWidth,0);
    my_gradient.addColorStop(0,"rgba(22,19,33,0.2)");
    my_gradient.addColorStop(0.3,"rgba(22,19,33,1)");
    my_gradient.addColorStop(0.7,"rgba(22,19,33,1)");
    my_gradient.addColorStop(1,"rgba(22,19,33,0.2)");
    ctx.fillStyle = my_gradient;
    ctx.fillRect(maskleft,0,maskWidth,maskHeight);

    ctx.restore()
  }

  drawMain() {
    const files = this.props.files
    if (!files || files.length <= 0) return

    const canvas = this._canvasMain
    if (!canvas) return

    const width = canvas.width
    const height = canvas.height
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, width, height)
    ctx.save()

    var context = this;
    files.forEach( function(f){
      const start = context.timeToX(f.start)
      const end = context.timeToX(f.end)

      if (end <= 0 || start >= width) return

      ctx.beginPath()
      ctx.moveTo(start, height - 1)
      ctx.lineTo(start, height - 1 - 17)
      ctx.lineTo(end, height - 1 - 17)
      ctx.lineTo(end, height - 1)
      ctx.closePath();

      ctx.fillStyle = 'rgba(3, 123, 221, 0.3)'
      ctx.fill()
    })

    ctx.restore()
  }

  drawIndicator() {
    const canvas = this._canvasInd
    if (!canvas) return

    const spanSetting = this.getSpanSetting()

    const width = canvas.width
    const height = canvas.height
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, width, height)
    ctx.save()

    const middle = this.getIndicatorTime()
    const midstr = TimelineUtil.getTimeString(middle, 'hh:mm:ss')
    const middleX = width / 2

    ctx.beginPath()
    ctx.moveTo(middleX, height)
    ctx.lineTo(middleX, height - 21)
    ctx.strokeStyle = 'rgb(188, 78, 174)'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.font = '12px 微软雅黑'
    ctx.textAlign = 'center'

    ctx.beginPath()
    ctx.fillStyle = 'rgb(188, 78, 174)'
    ctx.fillText(midstr, middleX, 12);

    ctx.restore()
  }

  getAllCanvas() {
    return [
      this._canvasInd, this._canvasMain,
      this._canvasBkg, this._canvasTicks
    ]
  }

  handleResize(e) {
    if (!this._container) return

    const width = this._container.clientWidth
    const height = this._container.clientHeight

    const canvas = this.getAllCanvas()
    canvas.forEach((c) => {
      if (c) {
        const style = window.getComputedStyle(c)
        c.width = width
        c.height = height +
          (-parseInt(style.marginTop)) +
          (-parseInt(style.marginBottom))
      }
    })

    this.tickShifting()
  }

  handleTouchStart(e) {
    e.preventDefault();

    const info = TimelineUtil.convertTouchInfo(e);
    this.moveStart(info);
  }

  handleTouchMove(e) {
    e.preventDefault();

    const info = TimelineUtil.convertTouchInfo(e);
    this.moving(info);
  }

  handleTouchEnd(e) {
    e.preventDefault();
    this.moveEnd();
  }

  handleTouchCancel(e) {
    this.handleTouchEnd(e);
  }

  handleClick(e) {
    console.log(e);
    e.preventDefault();
  }

  handleDoubleClick(e) {
    console.log(e);
    e.preventDefault();
  }

  handleMouseDown(e) {
    e.preventDefault();
    this.moveStart(e);
  }

  moveStart(pos) {
    this.actionStatus.setMouseInfo(pos);
    this.actionStatus.originMouseInfo = this.actionStatus.mouseInfo;
    this.actionStatus.oldMouseInfo = null;
    this.actionStatus.shifting = true;
    this.actionStatus.animating = false;
  }

  handleMouseMove(e) {
    e.preventDefault();
    this.moving(e);
  }

  moving(pos) {
    if (!this.actionStatus.shifting || !this.actionStatus.mouseInfo) return;

    var prev = this.actionStatus.setMouseInfo(pos);

    var distance = TimelineUtil.calcDistance(this.actionStatus.mouseInfo, prev);
    this.shift(distance, this.actionStatus.mouseInfo.x < prev.x);
  }

  handleMouseUp(e) {
    e.preventDefault();
    this.moveEnd(e);
  }

  moveEnd(pos) {
    if (!this.actionStatus.shifting || !this.actionStatus.mouseInfo) return;

    if (pos) {
      var prev = this.actionStatus.setMouseInfo(pos);
      this.actionStatus.calcSpeed(prev);
    } else {
      this.actionStatus.calcSpeed(this.actionStatus.oldMouseInfo);
    }

    this.actionStatus.shifting = false;
    this.actionStatus.animating = true;
    this.actionStatus.mouseInfo = null;

    this.startAnimation();
  }

  handleMouseLeave(e) {
    this.handleMouseUp(e)
  }

  handleMouseEnter(e) {
    console.log(e);
  }

  handleMouseOut(e) {
    console.log(e);
  }

  handleMouseOver(e) {
    console.log(e);
  }

  shift(d, left) {
    const shiftPeriod = this.distanceToPeriod(d)
    let start = this.getStartTime()
    if (left) {
      start = new Date(start.getTime() + shiftPeriod)
    } else {
      start = new Date(start.getTime() - shiftPeriod)
    }

    this.setStartTime(start)
  }

  getContentSize() {
    const ret = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }

    const canvas = this._canvasMain;
    if (canvas) {
      ret.width = canvas.width
      ret.height = canvas.height
    }

    return ret
  }

  timeToX(time) {
    const contentSize = this.getContentSize()

    let t = time
    if (!(time instanceof Date)) {
      t = new Date(+time)
    }

    if (isNaN(t.getTime())) {
      throw 'Invalid Date object received'
    } else {
      return this.periodToDistance(
              t - this.getStartTime()) +
            contentSize.x
    }
  }

  xToTime(x) {
    const contentSize = this.getContentSize()
    return new Date(this.distanceToPeriod(x - contentSize.x) +
                    this.getStartTime().getTime())
  }

  periodToDistance(p) {
    const contentSize = this.getContentSize()
    const spanSetting = this.getSpanSetting()
    return p * contentSize.width / spanSetting.totalTime
  }

  distanceToPeriod(d) {
    const contentSize = this.getContentSize()
    const spanSetting = this.getSpanSetting()
    return d * spanSetting.totalTime / contentSize.width
  }

  getSpanSetting() {
    return TimeLine.SpanSetting[this.props.span] || TimeLine.SpanSetting['4h']
  }

  initStartTime() {
    this._startTime = new Date();
    this._startTime.setHours(0, 0, 0, 0);
  }

  setStartTime(t) {
    if (!t) return

    if (!this._startTime || this._startTime.getTime() !== t.getTime()) {
      const oldStart = this._startTime
      this._startTime = t
      this.tickShifting()

      if (this.props.onStartTimeChange) {
        this.props.onStartTimeChange(oldStart, this._startTime)
      }
    }
  }

  getStartTime() {
    return this._startTime
  }

  setEndTime(t) {
    if (!t) return

    const spanSetting = this.getSpanSetting()
    const start = new Date(t.getTime() - spanSetting.totalTime)
    this.setStartTime(start)
  }

  getEndTime() {
    const spanSetting = this.getSpanSetting()
    const start = this.getStartTime()
    return new Date(start.getTime() + spanSetting.totalTime)
  }

  getIndicatorTime() {
    const spanSetting = this.getSpanSetting()
    const start = this.getStartTime()
    return new Date(start.getTime() + spanSetting.totalTime / 2)
  }

  getOtherLayers() {
    return []
  }

  render() {
    const self = this;
    const rootClass = [styles.timeline, this.props.className].join(' ');

    return (
      <div id="timeline-container" className={rootClass}
        ref={c => this._container = c}
        onClick={self.props.onClick}
        onDoubleClick={self.props.onDoubleClick}
        onMouseDown={self.handleMouseDown}
        onMouseMove={self.handleMouseMove}
        onMouseUp={self.handleMouseUp}
        onMouseLeave={self.handleMouseLeave}
        onMouseEnter={self.handleMouseEnter}
        onMouseOut={self.handleMouseOut}
        onMouseOver={self.handleMouseOver}
        onTouchStart={self.handleTouchStart}
        onTouchEnd={self.handleTouchEnd}
        onTouchMove={self.handleTouchMove}
        onTouchCancel={self.handleTouchCancel}
      >
        <canvas id="canvas_ticks"
          ref={c => this._canvasTicks = c}
        />
        <canvas id="canvas_bkg"
          ref={c => this._canvasBkg = c}
        />
        <canvas id="canvas_main"
          ref={c => this._canvasMain = c}
        />
        <canvas id="canvas_indicator"
          ref={c => this._canvasInd = c}
        />
        { this.getOtherLayers() }
      </div>
    );
  }
}
