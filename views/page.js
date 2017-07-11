'use strict';

const page = (req, res, next) => {
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
  </body>
</html>`);
};

module.exports = page;
