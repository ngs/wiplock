import React, { Component } from 'react';

import './index.styl';

export default class App extends Component {
  render() {
    return (
      <div className='app'>
        <h1>App</h1>
        {this.props.children}
      </div>
    );
  }
}

App.displayName = 'App';
