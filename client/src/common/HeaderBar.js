import React, { Component } from 'react';
import './HeaderBar.css';

export default class HeaderBar extends Component {
  render() {
    return (
      <div className="headerbar">
          <div className="title"><span>Tasky</span></div>
      </div>
    );
  }
}