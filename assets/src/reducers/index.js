import { combineReducers } from 'redux';
import repositories from './repositories';
import repositoriesByOrg from './repositoriesByOrg';

export default combineReducers({
  repositories,
  repositoriesByOrg
});
