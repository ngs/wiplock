import ActionTypes from '../constants/ActionTypes';

const getInitialState = () => ({
  isFetching: false,
  data: null,
  didInvalidate: false,
  error: null
});

export default function repositories(state = getInitialState(), action) { // eslint-disable-line complexity
  switch (action.type) {
  case ActionTypes.FETCH_USER_REQUEST:
    return {
      ...state,
      isFetching: true
    };
  case ActionTypes.FETCH_USER_SUCCESS:
    return {
      ...state,
      data: action.data,
      isFetching: false
    };
  case ActionTypes.FETCH_USER_FAILURE:
    const { error } = action;
    return {
      ...state,
      error
    };
  default:
    return state;
  }
}
