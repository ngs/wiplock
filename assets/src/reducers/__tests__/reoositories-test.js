import repositories from '../repositories';
import ActionTypes from '../../constants/ActionTypes';

describe('organizations reducer', () => {
  let subject;
  let state;
  let action;
  beforeEach(() => {
    state = () => undefined;
    action = () => ({});
    subject = () => repositories(state(), action());
  });
  it('should return initial state', () => {
    expect(subject()).toEqual({
      isFetching: false,
      items: [],
      didInvalidate: false,
      error: null
    });
  });
  describe('fetching repositories', () => {
    it('should handle FETCH_REPOSITORIES_REQUEST', () => {
      action = () => ({
        type: ActionTypes.FETCH_REPOSITORIES_REQUEST
      });
      expect(subject()).toEqual({
        isFetching: true,
        items: [],
        didInvalidate: false,
        error: null
      });
    });
    it('should handle FETCH_REPOSITORIES_SUCCESS', () => {
      action = () => ({
        type: ActionTypes.FETCH_REPOSITORIES_SUCCESS,
        items: [{ id: 1 }, { id: 2 }, { id: 3 }]
      });
      expect(subject()).toEqual({
        isFetching: false,
        items: [{ id: 1 }, { id: 2 }, { id: 3 }],
        didInvalidate: false,
        error: null
      });
    });
    it('should handle FETCH_REPOSITORIES_FAILURE', () => {
      action = () => ({
        type: ActionTypes.FETCH_REPOSITORIES_FAILURE,
        error: new Error('Something happen')
      });
      expect(subject()).toEqual({
        isFetching: false,
        items: [],
        didInvalidate: false,
        error: new Error('Something happen')
      });
    });
  });
  describe('locking repository', () => {
    beforeEach(() => {
      state = () => ({
        isFetching: false,
        didInvalidate: false,
        error: null,
        items: [{ id: 1 }, { id: 2 }, { id: 3 }]
      });
    });
    it('should handle LOCK_REPOSITORY_REQUEST', () => {
      action = () => ({
        type: ActionTypes.LOCK_REPOSITORY_REQUEST,
        id: 1
      });
      expect(subject()).toEqual({
        isFetching: false,
        items: [
          {
            id: 1,
            isUpdatingLock: true,
            locked: true,
            lockError: null
          },
          { id: 2 },
          { id: 3 }
        ],
        didInvalidate: false,
        error: null
      });
    });
    it('should handle LOCK_REPOSITORY_SUCCESS', () => {
      action = () => ({
        type: ActionTypes.LOCK_REPOSITORY_SUCCESS,
        id: 1
      });
      expect(subject()).toEqual({
        isFetching: false,
        items: [
          {
            id: 1,
            isUpdatingLock: false,
            locked: true,
            lockError: null
          },
          { id: 2 },
          { id: 3 }
        ],
        didInvalidate: false,
        error: null
      });
    });
    it('should handle LOCK_REPOSITORY_FAILURE', () => {
      action = () => ({
        type: ActionTypes.LOCK_REPOSITORY_FAILURE,
        id: 1,
        error: new Error('Something happen')
      });
      expect(subject()).toEqual({
        isFetching: false,
        items: [
          {
            id: 1,
            isUpdatingLock: false,
            locked: false,
            lockError: new Error('Something happen')
          },
          { id: 2 },
          { id: 3 }
        ],
        didInvalidate: false,
        error: null
      });
    });
  });
  describe('unlocking repository', () => {
    beforeEach(() => {
      state = () => ({
        isFetching: false,
        didInvalidate: false,
        error: null,
        items: [{ id: 1 }, { id: 2 }, { id: 3 }]
      });
    });
    it('should handle UNLOCK_REPOSITORY_REQUEST', () => {
      action = () => ({
        type: ActionTypes.UNLOCK_REPOSITORY_REQUEST,
        id: 1
      });
      expect(subject()).toEqual({
        isFetching: false,
        items: [
          {
            id: 1,
            isUpdatingLock: true,
            locked: false,
            lockError: null
          },
          { id: 2 },
          { id: 3 }
        ],
        didInvalidate: false,
        error: null
      });
    });
    it('should handle UNLOCK_REPOSITORY_SUCCESS', () => {
      action = () => ({
        type: ActionTypes.UNLOCK_REPOSITORY_SUCCESS,
        id: 1
      });
      expect(subject()).toEqual({
        isFetching: false,
        items: [
          {
            id: 1,
            isUpdatingLock: false,
            locked: false,
            lockError: null
          },
          { id: 2 },
          { id: 3 }
        ],
        didInvalidate: false,
        error: null
      });
    });
    it('should handle UNLOCK_REPOSITORY_FAILURE', () => {
      action = () => ({
        type: ActionTypes.UNLOCK_REPOSITORY_FAILURE,
        id: 1,
        error: new Error('Something happen')
      });
      expect(subject()).toEqual({
        isFetching: false,
        items: [
          {
            id: 1,
            isUpdatingLock: false,
            locked: true,
            lockError: new Error('Something happen')
          },
          { id: 2 },
          { id: 3 }
        ],
        didInvalidate: false,
        error: null
      });
    });
  });
});
