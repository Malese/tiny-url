'use strict';

const url = require('url');
const shortlink = require('shortlink');

const users = {
  '910fe088-e396-41bd-9713-315222f4466b': [
    8540230845,
    4798743782,
    8043754890
  ]
};

const urls = {
  '9jXWaN': 'https://www.hd.se/2017-07-12/gigantiskt-isberg-har-brutit-sig-loss',
  '5eL2tg': 'https://expressjs.com',
  '8MmM66': ''
};

let serverURL;

/**
 * Sets current server-url and desired alphabet
 * @param {object} config
 * @param {string} config.serverUrl - express server config.
 * @param {string} config.alphabet - desired shortlink alphabet
 * @returns {void} or probably undefined by engine
 */
const init = (config) => {
  serverURL = url.parse(config.serverUrl || '');

  if (config.alphabet) {
    shortlink.alphabet = config.alphabet;
  }
};

/**
 * Returns acctual link resolved from short-link id.
 * @param {string} short - short-link identifier
 * @returns {string} link
 */
const resolve = (short) => {
  return urls[short] || '';
};

/**
 * get all short-links for user
 * @param {string} user - session-uuid
 * @returns {array} short-link object
 */
const get = (user) => {
  if (!serverURL) {
    console.log('INFO: No server-url set');
    return [];
  }

  return (users[user] || []).map(item => {
    const key = shortlink.encode(item) || '';
    const short = url.resolve(serverURL, key);
    const urlTarget = urls[key] || '';

    return {
      url: url.format(urlTarget), // all .format opts are true as default
      short: short
    };
  }).filter(item => item && item.url && item.short);
};

/**
 * Store new short-link
 * @param {string} link - url to shorten
 * @param {string} user - session-uuid
 * @returns {object} short-link object
 */
const set = (link, user) => {
  if (!serverURL) {
    console.log('INFO: No server-url set');
    return {};
  }

  const existing = get(user).filter(item => {
    // TODO use format? already stored with format?
    return item.url === url.format(link);
  });

  // User has link already?
  if (existing.length) {
    return existing[0];
  }

  // create 10-digit random string
  let random = Math.random().toString().slice(2, 12);

  // dont´t let strings starting with 0 (zero) through
  if (random.substr(0, 1) === '0') {
    random = Math.floor(Math.random() * 9 + 1).toString() + random.slice(1);
  }

  const key = shortlink.encode(random);

  urls[key] = link;

  users[user].push(random);

  // USE URL. ?
  return {
    url: link,
    short: url.resolve(serverURL, key)
  };
};

// const update = () => {
//   handle users (fifo)
//   clean urls
// };

module.exports = {
  init,
  resolve,
  set,
  get
};
