import React, { Component, PropTypes } from 'react';
import { ListGroupItem, Image, Media } from 'react-bootstrap';
import Switch from 'react-bootstrap-switch';
import './index.styl';
import '../../../../../../node_modules/react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.css';

export default class ListItem extends Component {
  constructor(props) {
    super(props);
    const { locked } = props;
    this.state = { locked };
  }

  render() {
    const { item, filterText } = this.props;
    const { locked } = this.state;
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
            <div className='pull-right'>
              <Switch onText={'\uf023'} offText={'\uf09c'} value={locked} bsSize='normal'
                onChange={(_, locked) => this.setState({ locked })} className='fa' />
            </div>
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

ListItem.defaultProps = {
  locked: false
};

ListItem.propTypes = {
  filterText: React.PropTypes.instanceOf(RegExp),
  locked: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      login: PropTypes.string.isRequired,
      avatar_url: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};
