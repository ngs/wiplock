import github from '../helpers/github';
import ActionTypes from '../constants/ActionTypes';

function fetchUserRequest() {
  return {
    type: ActionTypes.FETCH_USER_REQUEST
  };
}

function fetchUserSuccess(data) {
  return {
    type: ActionTypes.FETCH_USER_SUCCESS,
    data
  };
}

function fetchUserFailure(error) {
  return {
    type: ActionTypes.FETCH_USER_FAILURE,
    error
  };
}

const fetchUser = () => dispatch => {
  dispatch(fetchUserRequest());
  return github().getUser().getProfile()
    .then(({ data }) => dispatch(fetchUserSuccess(data)))
    .catch(error => {
      return dispatch(fetchUserFailure(error));
    })
    ;
};

const shouldfetchUser = (state) => { // eslint-disable-line complexity
  const user = state.user;
  if (!user || !user.data || !user.data.login) {
    return true;
  }
  if (user.isFetching) {
    return false;
  }
  return user.didInvalidate;
};

export const fetchUserIfNeeded = () => (dispatch, getState) => {
  if (shouldfetchUser(getState())) {
    return dispatch(fetchUser());
  }
};
