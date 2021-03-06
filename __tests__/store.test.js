'use strict';

const store = require('../utils/store');

describe('the store', () => {
  const user = '910fe088-e396-41bd-9713-315222f4466b';
  const serverUrl = 'http://127.0.0.1:3000';

  beforeAll(() => {
    store.init({
      serverUrl: serverUrl,
      alphabet: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    });
  });

  test('should return correct linkObject when storing new link', () => {
    const linkObject = store.set('https://test1.com', user) || {};
    const key = linkObject.short.slice( linkObject.short.lastIndexOf('/') + 1 );

    expect(linkObject)
      .toEqual({
        url: 'https://test1.com',
        short: serverUrl + '/' + key
      });
  });

  test('should return equal linkObjects when same user stores same link twice', () => {
    const linkObject1 = store.set('https://test2.com', user) || {};
    const linkObject2 = store.set('https://test2.com', user) || {};

    expect(linkObject1)
      .toEqual(linkObject2);
  });

  test('resolve method should return correct link using generated key after storing new link,', () => {
    const linkObject = store.set('https://test3.com', user) || {};
    const key = linkObject.short.slice( linkObject.short.lastIndexOf('/') + 1 );

    expect(store.resolve(key))
      .toBe('https://test3.com');
  });

  test('get method should return empty array for new/unknown users', () => {
    const user = '7e610e3e-928a-4a47-8bba-f087acdbc611';
    const linkObject = store.get(user) || {};

    expect(linkObject)
      .toEqual([]);
  });
});
