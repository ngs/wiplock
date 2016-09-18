import ActionTypes from '../constants/ActionTypes';

const getInitialState = () => ({
  isFetching: false,
  items: [],
  didInvalidate: false,
  error: null
});

export default function repositories(state = getInitialState(), action) { // eslint-disable-line complexity
  switch (action.type) {
  case ActionTypes.FETCH_REPOSITORIES_REQUEST:
    return {
      ...state,
      isFetching: true
    };
  case ActionTypes.FETCH_REPOSITORIES_SUCCESS:
    return {
      ...state,
      items: action.items,
      isFetching: false
    };
  case ActionTypes.FETCH_REPOSITORIES_FAILURE:
    const { error } = action;
    return {
      ...state,
      error
    };
  default:
    return state;
  }
}
