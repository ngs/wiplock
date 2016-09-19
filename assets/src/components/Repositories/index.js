import React, { Component, PropTypes } from 'react';
import { ListGroup, Breadcrumb, Panel, InputGroup, FormControl, FormGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';
import Icon from 'react-fa';
import escapeStringRegexp from 'escape-string-regexp';
import { fetchRepositoriesIfNeeded } from '../../actions/repositories';
import { fetchUserIfNeeded } from '../../actions/user';
import { selectOrganization } from '../../actions/organizations';
import ListItem from './components/ListItem';
import Spinner from '../Spinner';
import './index.styl';

class Reporitories extends Component {

  constructor(...args) {
    super(...args);
    this.state = { filterText: '' };
  }

  selectOrganization(props) {
    const { user, dispatch, params } = props;
    const paramOrg = params.org;
    if (!user) {
      return;
    }
    const isUser = user.login === paramOrg;
    const org = isUser ? null : paramOrg;
    this.setState({ repos: [], org });
    dispatch(selectOrganization(org));
    dispatch(fetchRepositoriesIfNeeded(org));
  }

  componentDidMount() {
    this.props.dispatch(fetchUserIfNeeded());
    this.selectOrganization(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.org !== nextProps.params.org ||
      (!this.props.user && nextProps.user)) {
      this.selectOrganization(nextProps);
    }
  }

  renderContent() { // eslint-disable-line complexity
    const { isFetching, repos } = this.props;
    const { org } = this.props.params;
    if (isFetching) {
      return <Spinner />;
    }
    const filterText = this.state.filterText ?
      new RegExp(`(${escapeStringRegexp(this.state.filterText)})`, 'ig') : null;
    if (repos.length > 0) {
      const filteredRepos = repos.filter(({ name, owner: { login } }) =>
        !filterText || filterText.test(name) || filterText.test(login));
      return (
        <div>
          <FormGroup>
            <InputGroup>
              <InputGroup.Addon>
                <Icon name='search' />
              </InputGroup.Addon>
              <FormControl type='text' placeholder='Filter Repositories'
                onChange={e => this.setState({ filterText: e.target.value })} />
            </InputGroup>
          </FormGroup>
          <ListGroup>{filteredRepos.map(item =>
            <ListItem item={item} key={`repo-${item.id}`} filterText={filterText} />)}
          </ListGroup>
        </div>
      );
    }
    return <Panel bsStyle='warning'>You don't have admin permission for any repositories of {org}.</Panel>;
  }

  render() {
    return (
      <div id='repositories'>
        <Breadcrumb>
          <LinkContainer to={{ pathname: '/' }}>
            <Breadcrumb.Item>
              Select Organization
            </Breadcrumb.Item>
          </LinkContainer>
          <Breadcrumb.Item active>
            Lock Repositories
          </Breadcrumb.Item>
        </Breadcrumb>
        {this.renderContent()}
      </div>
    );
  }
}

Reporitories.displayName = 'Reporitories';

Reporitories.propTypes = {
  repos: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: PropTypes.shape({
    login: PropTypes.string.isRequired
  }),
  isFetching: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => { // eslint-disable-line complexity
  const {
    repositoriesByOrg: currentItems,
    selectedOrganization: org,
    user: currentUser
  } = state;
  const {
    isFetching: isFetchingRepos,
    items: allRepos
  } = currentItems[org || '@me'] || {
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
  const isFetching = isFetchingUser || isFetchingRepos;
  const repos = allRepos.filter(repo => repo.permissions.admin);
  return { repos, isFetching, org, user };
};

export default connect(mapStateToProps)(Reporitories);
