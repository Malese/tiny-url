'use strict';

const uuidv4 = require('uuid/v4');

// TODO init that sets cookie name?

let hostname = '127.0.0.1';
let sessionIdent = 'ident';

const init = (config) => {
  hostname = config.hostname || hostname;
  sessionIdent = config.name || sessionIdent;
};

const get = (req, res) => {
  let uuid;

  if ((req.cookies || {})[sessionIdent]) {
    uuid = req.cookies[sessionIdent];
  } else {
    // generate unique session-id
    uuid = uuidv4();
  }

  setCookie(req, res, uuid);

  return uuid;
};

const setCookie = (req, res, uuid) => {
  // maxAge = one year from now.
  const maxAge = 1000 * 60 * 60 * 24 * 365;

  // Date object set at one year from now.
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  if (res.cookie) {
    res.cookie(sessionIdent, uuid, {
      domain: '127.0.0.1',
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
