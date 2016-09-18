import React, { Component } from 'react';
import Icon from 'react-fa';
import './index.styl';

export default class Spinner extends Component {

  render() {
    return (
      <div className='spinner'>
        <Icon spin name='circle-o-notch' />
      </div>
    );
  }
}

Spinner.displayName = 'Spinner';

