import React, { Component, PropTypes } from 'react';
import { ListGroupItem, Image, Media } from 'react-bootstrap';
import './index.styl';

export default class ListItem extends Component {
  render() {
    const { item, filterText } = this.props;
    let { login } = item.owner;
    let { name } = item;
    if (filterText) {
      login = login.replace(filterText, '<span class="match">$1</span>');
      name = name.replace(filterText, '<span class="match">$1</span>');
    }
    return (
      <ListGroupItem className='repository-list-item'>
        <Media>
          <Media.Left>
            <Image src={item.owner.avatar_url} />
          </Media.Left>
          <Media.Body>
            <span className='title'>
              <span className='owner' dangerouslySetInnerHTML={{ __html: login + ' / ' }}></span>
              <span className='name' dangerouslySetInnerHTML={{ __html: name }}></span>
            </span>
          </Media.Body>
        </Media>
      </ListGroupItem>
    );
  }
}

ListItem.displayName = 'Organizations.ListItem';

ListItem.propTypes = {
  filterText: React.PropTypes.instanceOf(RegExp),
  locked: PropTypes.bool,
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      login: PropTypes.string.isRequired,
      avatar_url: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};
