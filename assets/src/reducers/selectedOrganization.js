import ActionTypes from '../constants/ActionTypes';

export default function selectedOrganization(state = '', action) {
  switch (action.type) {
  case ActionTypes.SELECT_ORGANIZATION:
    return action.org;
  default:
    return state;
  }
}
