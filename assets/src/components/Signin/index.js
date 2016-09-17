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
          <Button href='/login' bsSize='large'>
            Sign in with
            {' '}
            <Icon name='github' />
          </Button>
        </div>
      </div>
    );
  }
}

Siginin.displayName = 'Siginin';
