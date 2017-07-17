'use strict';

const url = require('url');
const shortlink = require('shortlink');

let serverURL;

const users = {};
/*
 * example content
 *
 * const users = { '910fe088-e396-41bd-9713-315222f4466b':
 *   [
 *     '6741443617',
 *     '7072623756',
 *     '1883733561'
 *   ]
 * };
 */

const urls = {};
/*
 * example content
 *
 * const urls = {
 *   '7meprz': 'https://www.2.se',
 *   '7IE0wI': 'https://www.3.se',
 *   '23tX9n': 'https://www.4.se'
 * };
 */

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
      url: urlTarget,
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
    return item.url === link;
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

  updateUser(random, user);

  return {
    url: link,
    short: url.resolve(serverURL, key)
  };
};

/**
 * Add link-ref to user-object. Truncate object
 * if needed (FIFO), and if so, remove from urls.
 * @param {string} random - 10 digit random string
 * @param {string} user - session-uuid
 * @returns {void} or probably undefined by engine
 */
const updateUser = (random, user) => {
  users[user] = users[user] || [];
  users[user].push(random);

  if (users[user].length > 10) {
    const id = users[user].shift();
    delete urls[shortlink.encode(id)];
  }
};

module.exports = {
  init,
  set,
  get,
  resolve
};
