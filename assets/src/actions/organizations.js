import github from '../helpers/github';
import ActionTypes from '../constants/ActionTypes';

function fetchOrganizationsRequest() {
  return {
    type: ActionTypes.FETCH_ORGANIZATIONS_REQUEST
  };
}

function fetchOrganizationsSuccess(items) {
  return {
    type: ActionTypes.FETCH_ORGANIZATIONS_SUCCESS,
    items
  };
}

function fetchOrganizationsFailure(error) {
  return {
    type: ActionTypes.FETCH_ORGANIZATIONS_FAILURE,
    error
  };
}

const fetchOrganizations = () => dispatch => {
  dispatch(fetchOrganizationsRequest());
  return github().getUser().listOrgs()
    .then(({ data }) => dispatch(fetchOrganizationsSuccess(data)))
    .catch(error => {
      return dispatch(fetchOrganizationsFailure(error));
    })
    ;
};

const shouldFetchOrganizations = (state) => { // eslint-disable-line complexity
  const orgs = state.organizations;
  if (!orgs || !orgs.items || !orgs.items.length) {
    return true;
  }
  if (orgs.isFetching) {
    return false;
  }
  return orgs.didInvalidate;
};

export const fetchOrganizationsIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchOrganizations(getState())) {
    return dispatch(fetchOrganizations());
  }
};

export const selectOrganization = org => ({
  type: ActionTypes.SELECT_ORGANIZATION,
  org
});
