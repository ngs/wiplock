import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { fetchOrganizationsIfNeeded } from '../organizations';
import ActionTypes from '../../constants/ActionTypes';
import { setAccessToken } from '../../helpers/github';
import nock from 'nock';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('organizations actions', () => {
  let scope;
  beforeEach(() => {
    scope = nock('https://api.github.com')
    .defaultReplyHeaders({
      'Access-Control-Allow-Headers': [
        'Authorization', 'Content-Type', 'If-Match', 'If-Modified-Since', 'If-None-Match',
        'If-Unmodified-Since', 'Accept-Encoding', 'X-GitHub-OTP', 'X-Requested-With'
      ].join(', '),
      'Access-Control-Allow-Methods:': 'GET, POST, PATCH, PUT, DELETE',
      'Access-Control-Allow-Origin': '*'
    })
    .intercept((() => true), 'OPTIONS')
    .query(true)
    .reply(204, '');
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
