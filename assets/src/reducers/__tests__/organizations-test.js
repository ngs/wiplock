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
      didInvalidate: false,
      error: null
    });
  });
  it('should handle FETCH_ORGANIZATIONS_REQUEST', () => {
    action = () => ({
      type: ActionTypes.FETCH_ORGANIZATIONS_REQUEST
    });
    expect(subject()).toEqual({
      isFetching: true,
      items: [],
      didInvalidate: false,
      error: null
    });
  });
  it('should handle FETCH_ORGANIZATIONS_SUCCESS', () => {
    action = () => ({
      type: ActionTypes.FETCH_ORGANIZATIONS_SUCCESS,
      items: [{ id: 1 }, { id: 2 }, { id: 3 }]
    });
    expect(subject()).toEqual({
      isFetching: false,
      items: [{ id: 1 }, { id: 2 }, { id: 3 }],
      didInvalidate: false,
      error: null
    });
  });
});
