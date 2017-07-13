'use strict';

const session = require('../utils/session');
const store = require('../utils/store');

const page = (req, res, next) => {
  const sessionUuid = session.get(req, res);
  let newLink;
  let newLinkNode = '';

  /**
   * Get store initialized
   */
  const serverUrl = req.protocol + '://' + req.get('host');

  store.init({
    serverUrl: serverUrl,
    alphabet: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  });

  /**
   * New incoming link
   */
  if (req.query && req.query.url) {
    newLink = store.set(req.query.url, sessionUuid);
    if (newLink) {
      newLinkNode = `<div><p>Her is your new short-link</p><a href="${newLink.short}">${newLink.short}</a></div>`;
    }
  }

  /**
   * Lists current user´s short-url´s
   */
  const list = store.get(sessionUuid);
  const listTable = list.map(item => {
    return '<p>' + item.url + ' ' + item.short + '</p>';
  }).join('\n');

  res.send(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/styles.css">
    <title>Tiny URL</title>
  </head>
  <body>
    <p>${sessionUuid}</p>
    ${newLinkNode}
    <form action="/">
      <!-- TODO remove link -->
      <input type="text" placeholder="http://url.to/shorten" name="url" value="https://www.google.se/maps" />
      <button type="submit">shrink!</button>
    </form>
    <p>${listTable}</p>
  </body>
</html>`);
};

module.exports = page;
