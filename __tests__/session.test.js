'use strict';

const session = require('../utils/session');

test('Should return new valid uuid v4', () => {
  const sessionUuid = session.get({}, {});

  expect(sessionUuid)
    .toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
});

test('Should return uuid from req.cookies-object', () => {
  const sessionUuid = session.get({
    cookies: {
      'tiny-ident': 'adfffb70-7652-402a-a82f-e1e2b3db28a8'
    }
  }, {});
  
  expect(sessionUuid)
    .toBe('adfffb70-7652-402a-a82f-e1e2b3db28a8');
});
