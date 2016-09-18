import ActionTypes from '../constants/ActionTypes';
import repositories from './repositories';

export default function repositoriesByOrg(state = {}, action) { // eslint-disable-line complexity
  const org = action.org || '@me';
  switch (action.type) {
  case ActionTypes.FETCH_REPOSITORIES_REQUEST:
  case ActionTypes.FETCH_REPOSITORIES_SUCCESS:
  case ActionTypes.FETCH_REPOSITORIES_FAILURE:
    return {
      ...state,
      [org]: repositories(state[org], action)
    };
  default:
    return state;
  }
}
