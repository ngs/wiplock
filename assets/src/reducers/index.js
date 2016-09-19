import { combineReducers } from 'redux';
import repositories from './repositories';
import organizations from './organizations';
import repositoriesByOrg from './repositoriesByOrg';
import selectedOrganization from './selectedOrganization';
import user from './user';

export default combineReducers({
  organizations,
  repositories,
  repositoriesByOrg,
  selectedOrganization,
  user
});
