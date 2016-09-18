import React, { Component, PropTypes } from 'react';
import { ListGroup, Breadcrumb } from 'react-bootstrap';
import { connect } from 'react-redux';
import { fetchOrganizationsIfNeeded } from '../../actions/organizations';
import { fetchUserIfNeeded } from '../../actions/user';
import ListItem from './components/ListItem';
import Spinner from '../Spinner';
import './index.styl';

class Organizations extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchUserIfNeeded());
    dispatch(fetchOrganizationsIfNeeded());
  }

  render() {
    const { orgs, user, isFetching } = this.props;

    return (
      <div id='organizations'>
        <Breadcrumb>
          <Breadcrumb.Item active>
            Select Organization
          </Breadcrumb.Item>
        </Breadcrumb>
        {isFetching ?
          <Spinner /> :
          <ListGroup>
            {user ? <ListItem item={user} key={`user-${user.login}`} /> : null}
            {orgs.map(item => <ListItem item={item} key={`org-${item.login}`} />)}
          </ListGroup>}
      </div>
    );
  }
}

Organizations.displayName = 'Organizations';

Organizations.propTypes = {
  orgs: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: PropTypes.shape({
    login: PropTypes.string.isRequired,
    avatar_url: PropTypes.string.isRequired
  }),
  isFetching: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => { // eslint-disable-line complexity
  const { organizations: currentItems, user: currentUser } = state;
  const {
    isFetching: isFetchingOrgs,
    items: orgs
  } = currentItems || {
    isFetching: true,
    items: []
  };
  const {
    isFetching: isFetchingUser,
    data: user
  } = currentUser || {
    isFetching: true,
    data: null
  };
  const isFetching = isFetchingOrgs || isFetchingUser;
  return { orgs, isFetching, user };
};

export default connect(mapStateToProps)(Organizations);
