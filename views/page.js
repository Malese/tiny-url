'use strict';

const session = require('../utils/session');

const page = (req, res, next) => {
  const sessionUuid = session.get(req, res);

  res.send(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/styles.css">
    <title>Tiny URL</title>
  </head>
  <body>
    <h1>tiny-url express</h1>
    <p>${sessionUuid}</p>
  </body>
</html>`);
};

module.exports = page;
