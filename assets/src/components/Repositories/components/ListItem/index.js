import React, { Component, PropTypes } from 'react';
import { ListGroupItem, Image, Media } from 'react-bootstrap';
import Switch from 'react-bootstrap-switch';
import Icon from 'react-fa';
import { connect } from 'react-redux';
import { setRepositoryLock } from '../../../../actions/setRepositoryLock';
import './index.styl';
import '../../../../../../node_modules/react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.css';

class ListItem extends Component {

  render() { // eslint-disable-line complexity
    const { item, filterText, dispatch } = this.props;
    let { login } = item.owner;
    let { name } = item;
    const { html_url, private: isPrivate, locked, isUpdatingLock, id } = item;
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
              <Switch onText={'\uf023'} offText={'\uf09c'} bsSize='normal'
                disabled={isUpdatingLock} value={locked || false} className='fa'
                onChange={(_, locked) => dispatch(setRepositoryLock(id, locked))} />
            </div>
            <a className='title' href={html_url} target='_blank'>
              <span className='owner' dangerouslySetInnerHTML={{ __html: login + ' / ' }}></span>
              <span className='name' dangerouslySetInnerHTML={{ __html: name }}></span>
              {isPrivate ? <Icon name='lock' /> : null}
            </a>
          </Media.Body>
        </Media>
      </ListGroupItem>
    );
  }
}

ListItem.displayName = 'Organizations.ListItem';

ListItem.propTypes = {
  filterText: PropTypes.instanceOf(RegExp),
  dispatch: PropTypes.func.isRequired,
  repoId: PropTypes.number.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    private: PropTypes.bool.isRequired,
    locked: PropTypes.bool,
    isUpdatingLock: PropTypes.lock,
    lockError: PropTypes.instanceOf(Error),
    owner: PropTypes.shape({
      login: PropTypes.string.isRequired,
      avatar_url: PropTypes.string.isRequired
    }).isRequired
  })
};

const mapStateToProps = (state, ownProps) => { // eslint-disable-line complexity
  const { repoId } = ownProps;
  const { repositories: currentItems } = state;
  const { items } = currentItems || {
    isFetching: true,
    items: []
  };
  const item = items.filter(item => item.id === repoId)[0];
  return { item };
};

export default connect(mapStateToProps)(ListItem);
