import React, { Component, PropTypes } from 'react';
import { ListGroupItem, Image, Media } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './index.styl';

export default class ListItem extends Component {
  render() {
    const { item } = this.props;
    return (
      <LinkContainer to={{ pathname: `/${item.login}` }} className='organization-list-item'>
        <ListGroupItem>
          <Media>
            <Media.Left>
              <Image src={item.avatar_url} />
            </Media.Left>
            <Media.Body>
              <span className='login'>{item.login}</span>
            </Media.Body>
          </Media>
        </ListGroupItem>
      </LinkContainer>
    );
  }
}

ListItem.displayName = 'Organizations.ListItem';

ListItem.propTypes = {
  item: PropTypes.shape({
    login: PropTypes.string.isRequired,
    avatar_url: PropTypes.string.isRequired
  }).isRequired
};
