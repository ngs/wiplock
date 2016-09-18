import ActionTypes from '../constants/ActionTypes';
import assign from 'object-assign';

const getInitialState = () => ({
  isFetching: false,
  items: [],
  more: false,
  completed: false,
  nextURL: null,
  lastURL: null,
  error: null
});

export default function repositories(state = getInitialState(), action) { // eslint-disable-line complexity
  const newState = assign({}, getInitialState(), state);
  let { items } = newState;
  switch (action.type) {
  case ActionTypes.FETCH_ORGANIZATIONS:
    items = action.more ? items : [];
    return {
      ...newState,
      items,
      isFetching: true
    };
  case ActionTypes.FETCH_ORGANIZATIONS_SUCCESS:
    const { nextURL, lastURL } = action;
    const completed = !nextURL;
    items = (action.more ? items : []).concat(action.items);
    return {
      ...newState,
      items,
      completed,
      nextURL: nextURL || null,
      lastURL: lastURL || null,
      isFetching: false
    };
  case ActionTypes.FETCH_ORGANIZATIONS_FAILURE:
    const { error } = action;
    return {
      ...newState,
      error
    };
  default:
    return state;
  }
}
