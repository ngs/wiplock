import ActionTypes from '../constants/ActionTypes';
import apiBase from '../constants/apiBase';
import fetch from 'isomorphic-fetch';

function fetchRepositoriesRequest() {
  return {
    type: ActionTypes.FETCH_REPOSITORIES_REQUEST
  };
}

function fetchRepositoriesSuccess(items) {
  return {
    type: ActionTypes.FETCH_REPOSITORIES_SUCCESS,
    items
  };
}

function fetchRepositoriesFailure(error) {
  return {
    type: ActionTypes.FETCH_REPOSITORIES_FAILURE,
    error
  };
}

const fetchRepositories = () => dispatch => {
  dispatch(fetchRepositoriesRequest());
  return fetch(`${apiBase}/repos`, { credentials: 'include' })
    .then(res => res.json())
    .then(json => dispatch(fetchRepositoriesSuccess(json)))
    .catch(error => {
      return dispatch(fetchRepositoriesFailure(error));
    })
    ;
};

const shouldFetchRepositories = (state) => { // eslint-disable-line complexity
  const { repositories } = state;
  if (!repositories || !repositories.items || !repositories.items.length) {
    return true;
  }
  if (repositories.isFetching) {
    return false;
  }
  return repositories.didInvalidate;
};

export const fetchRepositoriesIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchRepositories(getState())) {
    return dispatch(fetchRepositories());
  }
};
