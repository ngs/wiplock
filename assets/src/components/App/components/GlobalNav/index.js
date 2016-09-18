import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Navbar, Nav, NavItem } from 'react-bootstrap';

import './index.styl';

export default class GlobalNav extends Component {
  render() {
    return (
      <Navbar id='global-nav'>
        <Navbar.Header>
          <Navbar.Brand>
            <LinkContainer to={{ pathname: '/' }} className='navbar-brand'>
              <Button bsStyle='link'>Wiplock</Button>
            </LinkContainer>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem href='https://github.com/ngs/wiplock' target='_blank'>Get Source</NavItem>
            <NavItem href='/logout'>Sign out</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

GlobalNav.displayName = 'GlobalNav';

