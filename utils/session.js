'use strict';

const uuidv4 = require('uuid/v4');

const sessionIdent = 'tiny-ident';

const get = (req, res) => {
  let uuid;

  if ((req.cookies || {})[sessionIdent]) {
    return req.cookies[sessionIdent]
  } else {
    // generate unique session-id
    uuid = uuidv4();

    set(res, uuid);

    return uuid;
  }
};

const set = (res, uuid) => {
  // maxAge = one year from now.
  const maxAge = 1000*60*60*24*365;

  // Date object set at one year from now.
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  res.cookie(sessionIdent, uuid, {
    httpOnly: true,
    expires: expires,
    maxAge: maxAge
  });
};

module.exports = {
  get
};
