import ActionTypes from '../constants/ActionTypes';
// import fetch from 'isomorphic-fetch';

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

// const lockRepositoryFailure = (id) => {
//   return {
//     type: ActionTypes.LOCK_REPOSITORY_FAILURE,
//     id
//   };
// };
//
// const unlockRepositoryFailure = (id) => {
//   return {
//     type: ActionTypes.UNLOCK_REPOSITORY_FAILURE,
//     id
//   };
// };

const requestRepositoryLock = (id, locked) => dispatch => {
  if (locked) {
    dispatch(lockRepositoryRequest(id));
    // TODO: fetch
    setTimeout(() => {
      dispatch(lockRepositorySuccess(id));
    }, 500);
  } else {
    dispatch(unlockRepositoryRequest(id));
    // TODO: fetch
    setTimeout(() => {
      dispatch(unlockRepositorySuccess(id));
    }, 500);
  }
};

export const setRepositoryLock = (id, locked) => (dispatch) => {
  return dispatch(requestRepositoryLock(id, locked));
};
