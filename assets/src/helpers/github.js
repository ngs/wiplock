import GitHub from 'github-api';

let accessToken = null;

export const setAccessToken = (token) => accessToken = token;

export const getAccessToken = () => accessToken;

export default function github(token = getAccessToken()) {
  return new GitHub({ token });
}
