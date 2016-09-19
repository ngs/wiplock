import React, { Component, PropTypes } from 'react';
import { ListGroup, Panel, InputGroup, FormControl, FormGroup,
  DropdownButton, MenuItem, Image } from 'react-bootstrap';
import { connect } from 'react-redux';
import Icon from 'react-fa';
import escapeStringRegexp from 'escape-string-regexp';
import { fetchRepositoriesIfNeeded } from '../../actions/repositories';
import ListItem from './components/ListItem';
import Spinner from '../Spinner';
import './index.styl';

class Reporitories extends Component {

  constructor(...args) {
    super(...args);
    this.state = { filterText: '', selectedOrg: null };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchRepositoriesIfNeeded());
  }

  renderFilterForm() {
    const { repos } = this.props;
    const { selectedOrg } = this.state;
    const orgNames = repos.map(repo => repo.owner.login);
    const orgs = repos
      .map(repo => repo.owner)
      .filter((val, index) => orgNames.indexOf(val.login) === index)
      ;
    return (
      <FormGroup bsSize='large'>
        <InputGroup>
          <InputGroup.Addon>
            <Icon name='search' />
          </InputGroup.Addon>
          <FormControl type='text' placeholder='Filter Repositories'
            onChange={e => this.setState({ filterText: e.target.value })} />
          <DropdownButton
            bsSize='large'
            pullRight
            componentClass={InputGroup.Button}
            id='input-dropdown-addon'
            title={selectedOrg ?
              <Image rounded src={selectedOrg.avatar_url} width={20} height={20} /> :
              <Icon name='user' />}>
            <MenuItem key='__all' onClick={() => this.setState({ selectedOrg: null })}>All</MenuItem>
            {orgs.map(org => (
              <MenuItem key={org.login} onClick={() => this.setState({ selectedOrg: org })}>
                <Image rounded src={org.avatar_url} width={16} height={16} />
                {' '}
                {org.login}
              </MenuItem>))}
          </DropdownButton>
        </InputGroup>
      </FormGroup>
    );
  }

  renderList(repos, filterText) {
    if (repos.length > 0) {
      return (
        <ListGroup>{repos.map(item =>
          <ListItem item={item} key={`repo-${item.id}`} filterText={filterText} />)}
        </ListGroup>
      );
    }
  }

  renderEmpty(repos) {
    if (repos.length === 0) {
      return <Panel bsStyle='warning'>No repositories matched with <code>{this.state.filterText}</code>.</Panel>;
    }
  }

  renderContent() { // eslint-disable-line complexity
    const { isFetching, repos } = this.props;
    const { selectedOrg } = this.state;
    if (isFetching) {
      return <Spinner />;
    }
    const filterText = this.state.filterText ?
      new RegExp(`(${escapeStringRegexp(this.state.filterText)})`, 'ig') : null;
    if (repos.length > 0) {
      const filteredRepos = repos.filter(({ name, owner: { login } }) => // eslint-disable-line complexity
        (!filterText || filterText.test(name) || filterText.test(login)) &&
        (!selectedOrg || selectedOrg.login === login));
      return (
        <div>
          {this.renderFilterForm()}
          {this.renderList(filteredRepos, filterText)}
          {this.renderEmpty(filteredRepos)}
        </div>
      );
    }
  }

  render() {
    return (
      <div id='repositories'>
        {this.renderContent()}
      </div>
    );
  }
}

Reporitories.displayName = 'Reporitories';

Reporitories.propTypes = {
  repos: PropTypes.arrayOf(PropTypes.object).isRequired,
  isFetching: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => { // eslint-disable-line complexity
  const {
    repositories: currentItems
  } = state;
  const {
    isFetching,
    items: allRepos
  } = currentItems || {
    isFetching: true,
    items: []
  };
  const repos = allRepos.filter(repo => repo.permissions.admin);
  return { repos, isFetching };
};

export default connect(mapStateToProps)(Reporitories);
