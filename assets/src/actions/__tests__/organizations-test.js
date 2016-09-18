import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { fetchOrganizationsIfNeeded } from '../organizations';
import ActionTypes from '../../constants/ActionTypes';
import { setAccessToken } from '../../helpers/github';
import { nockScope } from './helpers';
import nock from 'nock';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('organizations actions', () => {
  let scope;
  beforeEach(() => {
    scope = nockScope();
    nock.disableNetConnect();
    setAccessToken('test');
  });
  beforeEach(() => {
    scope
    .get('/user/orgs')
    .query(true)
    .reply(200, [{ id: 1 }, { id: 2 }, { id: 3 }])
    ;
  });
  afterEach(() => nock.cleanAll());

  it('creates FETCH_ORGANIZATIONS_SUCCESS when fetching todos has been done', () => {
    const expectedActions = [
      { type: ActionTypes.FETCH_ORGANIZATIONS_REQUEST },
      { type: ActionTypes.FETCH_ORGANIZATIONS_SUCCESS, items: [{ id: 1 }, { id: 2 }, { id: 3 }] }
    ];
    const store = mockStore({ organizations: {} });
    return store.dispatch(fetchOrganizationsIfNeeded())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
