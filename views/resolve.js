'use strict';

const store = require('../utils/store');

const page = (req, res, next) => {
  const short = (req.params && req.params.url) ? req.params.url : '';
  const resolved = store.resolve(short);

  if (resolved) {
    res.redirect(303, resolved);
  } else {
    next();
  }
};

module.exports = page;
