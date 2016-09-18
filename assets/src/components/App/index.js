import React, { Component } from 'react';
import GlobalNav from './components/GlobalNav';
import './index.styl';

export default class App extends Component {
  render() {
    return (
      <div className='app'>
        <GlobalNav />
        <div className='container'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

App.displayName = 'App';
