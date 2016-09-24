import React, { Component } from 'react';
import Icon from 'react-fa';
import './index.styl';
import { Button } from 'react-bootstrap';

export default class Siginin extends Component {
  render() {
    return (
      <div id='signin'>
        <div className='container text-center'>
          <h1>Wiplock</h1>
          <p className='signin-button'>
            <Button href='/login' bsSize='large'>
              Sign in with
              {' '}
              <Icon name='github' />
            </Button>
          </p>
          <p className='whats-this'>
            <a href='https://ngs.io/2016/09/23/wiplock/' target='_blank'>What&apos;s this?</a>
          </p>
        </div>
      </div>
    );
  }
}

Siginin.displayName = 'Siginin';
