'use strict';

const uuidv4 = require('uuid/v4');

// TODO init that sets cookie name?

const sessionIdent = 'tiny-ident';

const get = (req, res) => {
  let uuid;

  if ((req.cookies || {})[sessionIdent]) {
    uuid = req.cookies[sessionIdent];
  } else {
    // generate unique session-id
    uuid = uuidv4();
  }

  set(res, uuid);

  return uuid;
};

// TODO: update cookie expire-time when used

const set = (res, uuid) => {
  // maxAge = one year from now.
  const maxAge = 1000 * 60 * 60 * 24 * 365;

  // Date object set at one year from now.
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  if (res.cookie) {
    res.cookie(sessionIdent, uuid, {
      httpOnly: true,
      expires: expires,
      maxAge: maxAge
    });
  }
};

module.exports = {
  get
};
