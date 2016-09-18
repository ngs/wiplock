import ActionTypes from '../constants/ActionTypes';
import repositories from './repositories';

export default function repositoriesByOrg(state = {}, action) { // eslint-disable-line complexity
  switch (action.type) {
  case ActionTypes.FETCH_REPOSITORIES:
  case ActionTypes.FETCH_REPOSITORIES_SUCCESS:
  case ActionTypes.FETCH_REPOSITORIES_FAILURE:
    if (action.org) {
      return {
        ...state,
        [action.org]: repositories(state[action.org], action)
      };
    }
  default:
    return state;
  }
}
