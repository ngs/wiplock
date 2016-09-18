import { combineReducers } from 'redux';
import repositories from './repositories';
import organizations from './organizations';
import repositoriesByOrg from './repositoriesByOrg';
import user from './user';

export default combineReducers({
  organizations,
  repositories,
  repositoriesByOrg,
  user
});
