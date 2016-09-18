import github from '../helpers/github';
import ActionTypes from '../constants/ActionTypes';

function fetchRepositoriesRequest(org) {
  return {
    type: ActionTypes.FETCH_REPOSITORIES_REQUEST,
    org
  };
}

function fetchRepositoriesSuccess(items, org) {
  return {
    type: ActionTypes.FETCH_REPOSITORIES_SUCCESS,
    items, org
  };
}

function fetchRepositoriesFailure(error) {
  return {
    type: ActionTypes.FETCH_REPOSITORIES_FAILURE,
    error
  };
}

const fetchRepositories = (org) => dispatch => {
  dispatch(fetchRepositoriesRequest(org));
  const gh = github();
  const api = org ? gh.getOrganization(org).getRepos() : gh.getUser().listRepos();
  return api
    .then(({ data }) => dispatch(fetchRepositoriesSuccess(data, org)))
    .catch(error => {
      return dispatch(fetchRepositoriesFailure(error));
    })
    ;
};

const shouldFetchRepositories = (state, org) => { // eslint-disable-line complexity
  const repos = state.repositoriesByOrg[org || '@me'];
  if (!repos) {
    return true;
  }
  if (repos.isFetching) {
    return false;
  }
  return repos.didInvalidate;
};

export const fetchRepositoriesIfNeeded = org => (dispatch, getState) => {
  if (shouldFetchRepositories(getState(), org)) {
    return dispatch(fetchRepositories(org));
  }
};
