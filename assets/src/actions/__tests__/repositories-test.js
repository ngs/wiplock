import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { fetchRepositoriesIfNeeded } from '../repositories';
import ActionTypes from '../../constants/ActionTypes';
import nock from 'nock';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('repositories actions', () => {
  beforeEach(() => {
    nock.disableNetConnect();
    nock('http://0.0.0.0:8000')
    .get('/api/repos')
    .query(true)
    .reply(200, [{ id: 1 }, { id: 2 }, { id: 3 }])
    ;
  });
  afterEach(() => nock.cleanAll());

  it('creates FETCH_REPOSITORIES_SUCCESS when fetching todos has been done', () => {
    const expectedActions = [
      { type: ActionTypes.FETCH_REPOSITORIES_REQUEST },
      { type: ActionTypes.FETCH_REPOSITORIES_SUCCESS, items: [{ id: 1 }, { id: 2 }, { id: 3 }] }
    ];
    const store = mockStore({ repositories: {} });
    return store.dispatch(fetchRepositoriesIfNeeded())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
