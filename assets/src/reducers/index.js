import { combineReducers } from 'redux';
import repositories from './repositories';
import organizations from './organizations';
import repositoriesByOrg from './repositoriesByOrg';

export default combineReducers({
  organizations,
  repositories,
  repositoriesByOrg
});
