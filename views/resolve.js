'use strict';

// const url = require('url');

const store = require('../utils/store');

const page = (req, res, next) => {
  const short = (req.params && req.params.url) ? req.params.url : '';
  const resolved = store.resolve(short);

  console.log('INFO: resolved ' + short + ' to ' + resolved);

  if (resolved) {
    res.redirect(303, resolved);
  } else {
    next();
  }

//   res.send(`<!DOCTYPE html>
// <html>
//   <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <link rel="stylesheet" href="/css/styles.css">
//     <title>Tiny URL</title>
//   </head>
//   <body>
//     <h1>tiny-url resolve</h1>
//     <p>${resolved}</p>
//   </body>
// </html>`);
};

module.exports = page;
