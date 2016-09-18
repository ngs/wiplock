import organizations from '../organizations';
import ActionTypes from '../../constants/ActionTypes';

describe('organizations reducer', () => {
  let subject;
  let state;
  let action;
  beforeEach(() => {
    state = () => undefined;
    action = () => ({});
    subject = () => organizations(state(), action());
  });
  it('should return initial state', () => {
    expect(subject()).toEqual({
      isFetching: false,
      items: [],
      more: false,
      completed: false,
      nextURL: null,
      lastURL: null,
      error: null
    });
  });
  describe('should handle FETCH_ORGANIZATIONS', () => {
    it('with empty state', () => {
      action = () => ({
        type: ActionTypes.FETCH_ORGANIZATIONS
      });
      expect(subject()).toEqual({
        isFetching: true,
        items: [],
        more: false,
        completed: false,
        nextURL: null,
        lastURL: null,
        error: null
      });
    });
    it('with existing items, more = false', () => {
      action = () => ({
        type: ActionTypes.FETCH_ORGANIZATIONS
      });
      state = () => ({
        items: [{ id: 1 }, { id: 2 }, { id: 3 }]
      });
      expect(subject()).toEqual({
        isFetching: true,
        items: [],
        more: false,
        completed: false,
        nextURL: null,
        lastURL: null,
        error: null
      });
    });
    it('with existing items, more = true', () => {
      action = () => ({
        type: ActionTypes.FETCH_ORGANIZATIONS,
        more: true
      });
      state = () => ({
        items: [{ id: 1 }, { id: 2 }, { id: 3 }]
      });
      expect(subject()).toEqual({
        isFetching: true,
        items: [{ id: 1 }, { id: 2 }, { id: 3 }],
        more: false,
        completed: false,
        nextURL: null,
        lastURL: null,
        error: null
      });
    });
  });
  describe('should handle FETCH_ORGANIZATIONS_SUCCESS', () => {
    describe('with empty state', () => {
      it('has more', () => {
        action = () => ({
          type: ActionTypes.FETCH_ORGANIZATIONS_SUCCESS,
          items: [{ id: 1 }, { id: 2 }, { id: 3 }],
          nextURL: 'https://api.github.com/user/repos?page=1&per_page=20',
          lastURL: 'https://api.github.com/user/repos?page=2&per_page=20'
        });
        expect(subject()).toEqual({
          isFetching: false,
          items: [{ id: 1 }, { id: 2 }, { id: 3 }],
          more: false,
          completed: false,
          nextURL: 'https://api.github.com/user/repos?page=1&per_page=20',
          lastURL: 'https://api.github.com/user/repos?page=2&per_page=20',
          error: null
        });
      });
      it('has no more', () => {
        action = () => ({
          type: ActionTypes.FETCH_ORGANIZATIONS_SUCCESS,
          items: [{ id: 1 }, { id: 2 }, { id: 3 }],
          nextURL: null,
          lastURL: 'https://api.github.com/user/repos?page=2&per_page=20'
        });
        expect(subject()).toEqual({
          isFetching: false,
          items: [{ id: 1 }, { id: 2 }, { id: 3 }],
          more: false,
          completed: true,
          nextURL: null,
          lastURL: 'https://api.github.com/user/repos?page=2&per_page=20',
          error: null
        });
      });
    });
    describe('with existing items', () => {
      beforeEach(() => {
        state = () => ({
          items: [{ id: 1 }, { id: 2 }, { id: 3 }]
        });
      });
      it('more = false', () => {
        action = () => ({
          more: false,
          type: ActionTypes.FETCH_ORGANIZATIONS_SUCCESS,
          items: [{ id: 4 }, { id: 5 }, { id: 6 }]
        });
        expect(subject()).toEqual({
          isFetching: false,
          items: [{ id: 4 }, { id: 5 }, { id: 6 }],
          more: false,
          completed: true,
          nextURL: null,
          lastURL: null,
          error: null
        });
      });
      it('more = true', () => {
        action = () => ({
          more: true,
          type: ActionTypes.FETCH_ORGANIZATIONS_SUCCESS,
          items: [{ id: 4 }, { id: 5 }, { id: 6 }]
        });
        expect(subject()).toEqual({
          isFetching: false,
          items: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }],
          more: false,
          completed: true,
          nextURL: null,
          lastURL: null,
          error: null
        });
      });
    });
  });
});
