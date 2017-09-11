export default class TimelineUtil {
  static numberToFixedWidthString(num, width) {
    var ret = '';

    if (0 === num) {
      for (var i = 0; i < width; i++) {
        ret += '0';
      }

      return ret;
    }

    for (var i = width-1; i >= 0; i--) {
      var div = parseInt(num / Math.pow(10, i));
      if (div === 0) {
        ret += '0';
      }
    }

    ret += num;
    return ret;
  }

  static getTimeString(time, format) {

    var ret = time.toString();

    var year = time.getFullYear(),
        month = time.getMonth(),
        day = time.getDate(),
        hour = time.getHours(),
        minute = time.getMinutes(),
        second = time.getSeconds();

    switch (format) {
      case 'hh:mm': // hour:minute, e.g. 02:01
        ret = this.numberToFixedWidthString(hour, 2) + ':' +
              this.numberToFixedWidthString(minute, 2);
        break;

      case 'hh:mm:ss': // hour:minute:second, e.g. 02:01:30
        ret = this.numberToFixedWidthString(hour, 2) + ':' +
              this.numberToFixedWidthString(minute, 2) + ':' +
              this.numberToFixedWidthString(second, 2);
        break;

      default:
        break;
    }

    return ret;
  }

  static calcDistance(p1, p2) {
    return Math.sqrt(
      Math.pow(p1.x - p2.x, 2) +
      Math.pow(p1.y - p2.y, 2)
    );
  }

  static convertTouchInfo(e) {
    return {
      clientX: e.targetTouches[0].clientX,
      clientY: e.targetTouches[0].clientY,
      timeStamp: e.timeStamp
    }
  }

  static getMouseInfo(e) {
    return {
      x: e.clientX,
      y: e.clientY,
      timeStamp: e.timeStamp
    }
  }

  static getTicks(start, end, mainUnit, subUnit, minorUnit) {
    const ticks = []

    let time = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
      start.getHours()
    )

    // 主刻度
    while (mainUnit && time <= end) {
      const timeNext = new Date(time.getTime() + mainUnit)

      let subTime = new Date(time)
      // 辅刻度
      while (subUnit && subTime <= timeNext) {
        const subTimeNext = new Date(subTime.getTime() + subUnit)

        let minorTime = new Date(subTime)
      // 小刻度
        while (minorUnit && minorTime <= subTimeNext) {
          const minorTimeNext = new Date(minorTime.getTime() + minorUnit)

          if (subTime < minorTime && minorTime < subTimeNext) {
            ticks.push({
              time: minorTime,
              type: 'minor'
            })
          }

          minorTime = minorTimeNext
        }

        if (time < subTime && subTime < timeNext) {
          ticks.push({
            time: subTime,
            type: 'sub'
          })
        }

        subTime = subTimeNext
      }

      if (time >= start) {
        ticks.push({
          time: time,
          type: 'main'
        })
      }

      time = timeNext
    }

    return ticks
  }
}
