'use strict';

const session = require('../utils/session');
const store = require('../utils/store');
const validate = require('validate.js');
const ESAPI = require('node-esapi');

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
    // check is validity link
    const isNotUrl = validate({website: req.query.url}, {
      website: {
        url: {
          allowLocal: true
        }
      }
    });

    if (!isNotUrl) { // undefined if green-lighted
      newLink = store.set(req.query.url, sessionUuid);
      if (newLink) {
        newLinkNode = `<div><p>Here is your new short-link</p><a href="${newLink.short}">${newLink.short}</a></div>`;
      }
    } else {
      newLinkNode = `<div><p>Opps, was that the correct link</p>${ESAPI.encoder().encodeForHTML(req.query.url)}</div>`;
    }
  }

  /**
   * Lists current user´s short-url´s
   */
  const list = store.get(sessionUuid);
  const listTable = list.map(item => {
    return '<p><a href="' + ESAPI.encoder().encodeForHTML(item.url) + '">' + ESAPI.encoder().encodeForHTML(item.url) + '</a> ' + item.short + '</p>';
  }).join('\n');

  // TODO remove sessionUuid
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
      <input type="text" placeholder="http://url.to/shorten" name="url" />
      <button type="submit">shrink!</button>
    </form>
    <p>${listTable}</p>
  </body>
</html>`);
};

module.exports = page;
