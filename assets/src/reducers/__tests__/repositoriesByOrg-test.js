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
  it('should handle FETCH_REPOSITORIES', () => {
    let _state = {};
    state = () => _state;
    action = () => ({
      type: ActionTypes.FETCH_REPOSITORIES,
      org: 'ngs'
    });
    _state = subject();
    expect(subject()).toEqual({
      ngs: {
        isFetching: true,
        items: [],
        more: false,
        completed: false,
        nextURL: null,
        lastURL: null,
        error: null
      }
    });
    action = () => ({
      type: ActionTypes.FETCH_REPOSITORIES,
      org: 'littleapps'
    });
    expect(subject()).toEqual({
      ngs: {
        isFetching: true,
        items: [],
        more: false,
        completed: false,
        nextURL: null,
        lastURL: null,
        error: null
      },
      littleapps: {
        isFetching: true,
        items: [],
        more: false,
        completed: false,
        nextURL: null,
        lastURL: null,
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
      org: 'ngs',
      more: false,
      type: ActionTypes.FETCH_REPOSITORIES_SUCCESS,
      items: [{ id: 1 }, { id: 2 }, { id: 3 }],
      nextURL: 'https://api.github.com/ngs/repos?page=1&per_page=20',
      lastURL: 'https://api.github.com/ngs/repos?page=2&per_page=20'
    });
    subject();
    expect(subject()).toEqual({
      ngs: {
        isFetching: false,
        items: [{ id: 1 }, { id: 2 }, { id: 3 }],
        more: false,
        completed: false,
        nextURL: 'https://api.github.com/ngs/repos?page=1&per_page=20',
        lastURL: 'https://api.github.com/ngs/repos?page=2&per_page=20',
        error: null
      }
    });
    action = () => ({
      org: 'littleapps',
      more: false,
      type: ActionTypes.FETCH_REPOSITORIES_SUCCESS,
      items: [{ id: 1 }, { id: 2 }, { id: 3 }],
      nextURL: 'https://api.github.com/littleapps/repos?page=1&per_page=20',
      lastURL: 'https://api.github.com/littleapps/repos?page=2&per_page=20'
    });
    expect(subject()).toEqual({
      ngs: {
        isFetching: false,
        items: [{ id: 1 }, { id: 2 }, { id: 3 }],
        more: false,
        completed: false,
        nextURL: 'https://api.github.com/ngs/repos?page=1&per_page=20',
        lastURL: 'https://api.github.com/ngs/repos?page=2&per_page=20',
        error: null
      },
      littleapps: {
        isFetching: false,
        items: [{ id: 1 }, { id: 2 }, { id: 3 }],
        more: false,
        completed: false,
        nextURL: 'https://api.github.com/littleapps/repos?page=1&per_page=20',
        lastURL: 'https://api.github.com/littleapps/repos?page=2&per_page=20',
        error: null
      }
    });
    action = () => ({
      org: 'ngs',
      more: true,
      type: ActionTypes.FETCH_REPOSITORIES_SUCCESS,
      items: [{ id: 4 }, { id: 5 }, { id: 6 }],
      nextURL: null,
      lastURL: 'https://api.github.com/ngs/repos?page=2&per_page=20'
    });
    expect(subject()).toEqual({
      ngs: {
        isFetching: false,
        items: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }],
        more: false,
        completed: true,
        nextURL: null,
        lastURL: 'https://api.github.com/ngs/repos?page=2&per_page=20',
        error: null
      },
      littleapps: {
        isFetching: false,
        items: [{ id: 1 }, { id: 2 }, { id: 3 }],
        more: false,
        completed: false,
        nextURL: 'https://api.github.com/littleapps/repos?page=1&per_page=20',
        lastURL: 'https://api.github.com/littleapps/repos?page=2&per_page=20',
        error: null
      }
    });
  });
});
