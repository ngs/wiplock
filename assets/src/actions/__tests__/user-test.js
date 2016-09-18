import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { fetchUserIfNeeded } from '../user';
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
    .get('/user')
    .query(true)
    .reply(200, { id: 1, name: 'test' })
    ;
  });
  afterEach(() => nock.cleanAll());

  it('creates FETCH_USER_SUCCESS when fetching todos has been done', () => {
    const expectedActions = [
      { type: ActionTypes.FETCH_USER_REQUEST },
      { type: ActionTypes.FETCH_USER_SUCCESS, data: { id: 1, name: 'test' } }
    ];
    const store = mockStore({});
    return store.dispatch(fetchUserIfNeeded())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
