import nock from 'nock';

export const nockScope = () => nock('https://api.github.com')
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
