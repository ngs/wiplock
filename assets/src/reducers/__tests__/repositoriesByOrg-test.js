import repositoriesByOrg from '../repositoriesByOrg';
import ActionTypes from '../../constants/ActionTypes';

describe('repositoriesByOrg reducer', () => {
  let subject;
  let state;
  let action;
  beforeEach(() => {
    state = () => undefined;
    action = () => ({ org: 'ngs' });
    subject = () => repositoriesByOrg(state(), action());
  });
  it('should return initial state', () => {
    expect(subject()).toEqual({});
  });
  it('should handle FETCH_REPOSITORIES_REQUEST', () => {
    let _state = {};
    state = () => _state;
    action = () => ({
      type: ActionTypes.FETCH_REPOSITORIES_REQUEST,
      org: undefined
    });
    _state = subject();
    expect(subject()).toEqual({
      '@me': {
        didInvalidate: false,
        isFetching: true,
        items: [],
        error: null
      }
    });
    action = () => ({
      type: ActionTypes.FETCH_REPOSITORIES_REQUEST,
      org: 'littleapps'
    });
    expect(subject()).toEqual({
      '@me': {
        didInvalidate: false,
        isFetching: true,
        items: [],
        error: null
      },
      littleapps: {
        didInvalidate: false,
        isFetching: true,
        items: [],
        error: null
      }
    });
  });
  it('should handle FETCH_REPOSITORIES_SUCCESS', () => {
    let _state = {};
    const orgSubject = subject;
    subject = () => {
      _state = orgSubject();
      return _state;
    };
    state = () => _state;
    action = () => ({
      didInvalidate: false,
      org: undefined,
      type: ActionTypes.FETCH_REPOSITORIES_SUCCESS,
      items: [{ id: 1 }, { id: 2 }, { id: 3 }]
    });
    subject();
    expect(subject()).toEqual({
      '@me': {
        didInvalidate: false,
        isFetching: false,
        items: [{ id: 1 }, { id: 2 }, { id: 3 }],
        error: null
      }
    });
    action = () => ({
      org: 'littleapps',
      type: ActionTypes.FETCH_REPOSITORIES_SUCCESS,
      items: [{ id: 1 }, { id: 2 }, { id: 3 }]
    });
    expect(subject()).toEqual({
      '@me': {
        didInvalidate: false,
        isFetching: false,
        items: [{ id: 1 }, { id: 2 }, { id: 3 }],
        error: null
      },
      littleapps: {
        didInvalidate: false,
        isFetching: false,
        items: [{ id: 1 }, { id: 2 }, { id: 3 }],
        error: null
      }
    });
  });
});
