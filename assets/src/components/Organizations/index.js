import React, { Component, PropTypes } from 'react';
import { ListGroup, Breadcrumb } from 'react-bootstrap';
import { connect } from 'react-redux';
import { fetchOrganizationsIfNeeded } from '../../actions/organizations';
import ListItem from './components/ListItem';
import './index.styl';

class Organizations extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchOrganizationsIfNeeded());
  }

  render() {
    return (
      <div id='organizations'>
        <Breadcrumb>
          <Breadcrumb.Item active>
            Select Organization
          </Breadcrumb.Item>
        </Breadcrumb>
        <ListGroup>
          {this.props.items.map(item => <ListItem item={item} key={`org-${item.login}`} />)}
        </ListGroup>
      </div>
    );
  }
}

Organizations.displayName = 'Organizations';

Organizations.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  isFetching: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const { organizations: currentItems } = state;
  const {
    isFetching,
    items
  } = currentItems || {
    isFetching: true,
    items: []
  };
  return { items, isFetching };
};

export default connect(mapStateToProps)(Organizations);
