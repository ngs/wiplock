import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

import './index.styl';

export default class GlobalNav extends Component {
  render() {
    return (
      <Navbar id='global-nav'>
        <Navbar.Header>
          <Navbar.Brand>
            Wiplock
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

