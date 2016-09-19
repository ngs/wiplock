import ActionTypes from '../constants/ActionTypes';
import apiBase from '../constants/apiBase';
import fetch from 'isomorphic-fetch';

const lockRepositoryRequest = (id) => {
  return {
    type: ActionTypes.LOCK_REPOSITORY_REQUEST,
    id
  };
};

const unlockRepositoryRequest = (id) => {
  return {
    type: ActionTypes.UNLOCK_REPOSITORY_REQUEST,
    id
  };
};

const lockRepositorySuccess = (id) => {
  return {
    type: ActionTypes.LOCK_REPOSITORY_SUCCESS,
    id
  };
};

const unlockRepositorySuccess = (id) => {
  return {
    type: ActionTypes.UNLOCK_REPOSITORY_SUCCESS,
    id
  };
};

const lockRepositoryFailure = (id, error) => {
  return {
    type: ActionTypes.LOCK_REPOSITORY_FAILURE,
    id,
    error
  };
};

const unlockRepositoryFailure = (id, error) => {
  return {
    type: ActionTypes.UNLOCK_REPOSITORY_FAILURE,
    id,
    error
  };
};

const requestRepositoryLock = (repo, locked) => dispatch => {
  const { id, owner: { login }, name } = repo;
  const slug = `${login}/${name}`;
  const url = `${apiBase}/${slug}/lock`;
  const request = (method, start, success, fail) => {
    dispatch(start(id));
    fetch(url, { method, credentials: 'include' })
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
    })
    .then(() => dispatch(success(id)))
    .catch(error => dispatch(fail(id, error)));
  };
  if (locked) {
    request('PUT',
      lockRepositoryRequest,
      lockRepositorySuccess,
      lockRepositoryFailure);
  } else {
    request('DELETE',
      unlockRepositoryRequest,
      unlockRepositorySuccess,
      unlockRepositoryFailure);
  }
};

export const setRepositoryLock = (id, locked) => (dispatch, getState) => {
  const { repositories: { items } } = getState();
  const repo = items.filter(repo => repo.id === id)[0];
  if (repo) {
    return dispatch(requestRepositoryLock(repo, locked));
  }
};
