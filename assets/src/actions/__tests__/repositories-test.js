import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { fetchRepositoriesIfNeeded } from '../repositories';
import ActionTypes from '../../constants/ActionTypes';
import { setAccessToken } from '../../helpers/github';
import { nockScope } from './helpers';
import nock from 'nock';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const testActions = org => {
  afterEach(() => nock.cleanAll());

  it('creates FETCH_REPOSITORIES_SUCCESS when fetching todos has been done', () => {
    const expectedActions = [
      { type: ActionTypes.FETCH_REPOSITORIES_REQUEST, org },
      { type: ActionTypes.FETCH_REPOSITORIES_SUCCESS, items: [{ id: 1 }, { id: 2 }, { id: 3 }], org }
    ];
    const store = mockStore({ repositoriesByOrg: {} });
    return store.dispatch(fetchRepositoriesIfNeeded(org))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
};

describe('repositories actions', () => {
  let scope;
  beforeEach(() => {
    scope = nockScope();
    nock.disableNetConnect();
    setAccessToken('test');
  });
  describe('org is set', () => {
    beforeEach(() => {
      scope
      .get('/orgs/littleapps/repos')
      .query(true)
      .reply(200, [{ id: 1 }, { id: 2 }, { id: 3 }])
      ;
    });
    testActions('littleapps');
  });
  describe('org is not set', () => {
    beforeEach(() => {
      scope
      .get('/user/repos')
      .query(true)
      .reply(200, [{ id: 1 }, { id: 2 }, { id: 3 }])
      ;
    });
    testActions();
  });
});
