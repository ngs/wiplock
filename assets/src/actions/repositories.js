import github from '../helpers/github';
import ActionTypes from '../constants/ActionTypes';

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
  const gh = github();
  return gh.getUser().listRepos()
    .then(({ data }) => dispatch(fetchRepositoriesSuccess(data)))
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
