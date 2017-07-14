'use strict';

const uuidv4 = require('uuid/v4');

// TODO init that sets cookie name?

let hostname = '127.0.0.1';
let name = 'ident';

/**
 * Sets current hostname and desired cookie-name
 * @param {object} config
 * @param {string} config.hostname - express server hostname.
 * @param {string} config.name - desired cookie-name
 * @returns {void} or probably undefined by engine
 */
const init = (config) => {
  hostname = config.hostname || hostname;
  name = config.name || name;
};

/**
 * Get unique user identifier
 * @param {object} req - express server request-object.
 * @param {object} res - express server response-object.
 * @returns {string} uuid v4
 */
const get = (req, res) => {
  let uuid;

  if ((req.cookies || {})[name]) {
    uuid = req.cookies[name];
  } else {
    // generate unique session-id
    uuid = uuidv4();
  }

  setCookie(req, res, uuid);

  return uuid;
};

/**
 * Set user identifier cookie
 * @param {object} req - express server request-object.
 * @param {object} res - express server response-object.
 * @param {string} uuid - uuid.
 * @returns {void} or probably undefined by engine
 */
const setCookie = (req, res, uuid) => {
  // maxAge = one year from now.
  const maxAge = 1000 * 60 * 60 * 24 * 365;

  // Date object set at one year from now.
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  if (res.cookie) {
    res.cookie(name, uuid, {
      domain: hostname,
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      expires: expires,
      maxAge: maxAge
    });
  }
};

module.exports = {
  init,
  get
};
