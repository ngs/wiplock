import keyMirror from 'keymirror';

const ActionTypes = keyMirror({
  FETCH_REPOSITORIES_REQUEST: null,
  FETCH_REPOSITORIES_SUCCESS: null,
  FETCH_REPOSITORIES_FAILURE: null,
  FETCH_ORGANIZATIONS_REQUEST: null,
  FETCH_ORGANIZATIONS_SUCCESS: null,
  FETCH_ORGANIZATIONS_FAILURE: null,
  FETCH_USER_REQUEST: null,
  FETCH_USER_SUCCESS: null,
  FETCH_USER_FAILURE: null,
  LOCK_REPOSITORY_REQUEST: null,
  LOCK_REPOSITORY_SUCCESS: null,
  LOCK_REPOSITORY_FAILURE: null,
  UNLOCK_REPOSITORY_REQUEST: null,
  UNLOCK_REPOSITORY_SUCCESS: null,
  UNLOCK_REPOSITORY_FAILURE: null
});

export default ActionTypes;
