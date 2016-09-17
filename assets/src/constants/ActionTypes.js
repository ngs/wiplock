import keyMirror from 'keymirror';

const ActionTypes = keyMirror({
  REQUEST_REPOSITORIES: null,
  REQUEST_ORGANIZATIONS: null,
  REQUEST_LOCKS: null,
  REQUEST_LOCK_REPOSITORY: null,
  REQUEST_UNLOCK_REPOSITORY: null,
  RECEIVE_REPOSITORIES: null,
  RECEIVE_ORGANIZATIONS: null,
  RECEIVE_LOCKS: null,
  RECEIVE_LOCK_REPOSITORY: null,
  RECEIVE_UNLOCK_REPOSITORY: null
});

export default ActionTypes;
