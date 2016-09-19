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
      error: null,
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
  case ActionTypes.LOCK_REPOSITORY_REQUEST:
  case ActionTypes.UNLOCK_REPOSITORY_REQUEST:
    return {
      ...state,
      items: state.items.map(item => {
        if (item.id === action.id) {
          return {
            ...item,
            isUpdatingLock: true,
            locked: /^LOCK/.test(action.type),
            lockError: null
          };
        }
        return item;
      })
    };
  case ActionTypes.LOCK_REPOSITORY_FAILURE:
  case ActionTypes.UNLOCK_REPOSITORY_FAILURE:
    return {
      ...state,
      items: state.items.map(item => {
        if (item.id === action.id) {
          return {
            ...item,
            isUpdatingLock: false,
            locked: !/^LOCK/.test(action.type),
            lockError: action.error
          };
        }
        return item;
      })
    };
  case ActionTypes.LOCK_REPOSITORY_SUCCESS:
  case ActionTypes.UNLOCK_REPOSITORY_SUCCESS:
    return {
      ...state,
      items: state.items.map(item => {
        if (item.id === action.id) {
          return {
            ...item,
            isUpdatingLock: false,
            locked: /^LOCK/.test(action.type),
            lockError: null
          };
        }
        return item;
      })
    };
  default:
    return state;
  }
}
