import React, { Component } from 'react';
import $ from 'jquery';
import styles from './inkbutton.less';

class InkButton extends Component {
  constructor(props) {
    super(props);
    this.onBtnClick = this.onBtnClick.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.start = {
      x:0,
      y:0
    }
  }
  onBtnClick(e){
    if(e.pageX - this.start.x > 5 || e.pageX - this.start.x < -5 ||
       e.pageY - this.start.y > 5 || e.pageY - this.start.y < -5){
         return;
       }
    if(this.props.clickfun){
      this.props.clickfun(e);
    }
  }
  onTouchStart(e){
    if(this.props.showanimate){
      var parent, ink, d, x, y;
      parent = $('#' + this.props.id);
      //create .ink element if it doesn't exist
      if(parent.find(".ink").length == 0)
        parent.prepend("<span class='ink'></span>");

      ink = parent.find(".ink");
      //incase of quick double clicks stop the previous animation
      ink.removeClass("animate");
      //set size of .ink
      if(!ink.height() && !ink.width())
      {
        //use parent's width or height whichever is larger for the diameter to make a circle which can cover the entire element.
        d = Math.max(parent.outerWidth(), parent.outerHeight());
        ink.css({height: d, width: d});
      }
      //get click coordinates
      //logic = click coordinates relative to page - parent's position relative to page - half of self height/width to make it controllable from the center;
      x = e.touches[0].pageX - parent.offset().left - ink.width()/2;
      y = e.touches[0].pageY - parent.offset().top - ink.height()/2;
      this.start.x = e.touches[0].pageX;
      this.start.y = e.touches[0].pageY;
      //set the position and add class .animate
      ink.css({top: y+'px', left: x+'px'}).addClass("animate");
    }
  }
  onMouseDown(e){
    if(this.props.showanimate){
      var parent, ink, d, x, y;
      parent = $('#' + this.props.id);
      //create .ink element if it doesn't exist
      if(parent.find("." + styles.ink).length == 0)
        parent.prepend("<span class='"+styles.ink+"'></span>");

      ink = parent.find("." + styles.ink);
      //incase of quick double clicks stop the previous animation
      ink.removeClass(styles.animate);
      //set size of .ink
      if(!ink.height() && !ink.width())
      {
        //use parent's width or height whichever is larger for the diameter to make a circle which can cover the entire element.
        d = Math.max(parent.outerWidth(), parent.outerHeight());
        ink.css({height: d, width: d});
      }
      //get click coordinates
      //logic = click coordinates relative to page - parent's position relative to page - half of self height/width to make it controllable from the center;
      x = e.pageX - parent.offset().left - ink.width()/2;
      y = e.pageY - parent.offset().top - ink.height()/2;
      this.start.x = e.pageX;
      this.start.y = e.pageY;
      //set the position and add class .animate
      ink.css({top: y+'px', left: x+'px'}).addClass(styles.animate);
    }
  }
  render() {
    return <div style={{overflow:'hidden'}} id={this.props.id} onTouchStart={this.onTouchStart}
     onMouseDown={this.onMouseDown} data-type={this.props.usertype} data-user={this.props.userdata} onClick={this.onBtnClick} className={this.props.stylename} title={this.props.titlename}>
    {this.props.value}
    </div>
  }
}

InkButton.defaultProps = { showanimate: true };

export default InkButton;
