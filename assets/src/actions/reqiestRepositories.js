import github from '../helpers/github';

const fetchRepositories = (org, more, state) => {

};

const shouldFetchRepositories = (state, org, more) => { // eslint-disable-line complexity
  const repos = state.repositoriesByOrg[org];
  if (!repos) {
    return true;
  }
  if (repos.isFetching) {
    return false;
  }
  if (more) {
    return true;
  }
  return !repos.completed;
};

export const fetchRepositoriesIfNeeded = (org, more) => (dispatch, getState) => {
  const state = getState();
  if (shouldFetchRepositories(state, org, more)) {
    return dispatch(fetchRepositories(org, more));
  }
};
