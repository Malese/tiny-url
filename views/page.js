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
   * New incoming link
   */
  if (req.query && req.query.url) {
    const queryUrl = req.query.url.trim();

    // check is validity link
    const isNotUrl = validate({website: queryUrl}, {
      website: {
        url: {
          allowLocal: true
        }
      }
    });

    if (!isNotUrl) { // undefined if green-lighted
      newLink = store.set(queryUrl, sessionUuid);
      if (newLink) {
        newLinkNode = `<div><p>Here is your new short-link</p><a href="${newLink.short}">${newLink.short}</a></div>`;
      }
    } else {
      newLinkNode = `<div><p>Opps, was that the correct link</p>${ESAPI.encoder().encodeForHTML(queryUrl)}</div>`;
    }
  }

  /**
   * Lists current user´s short-url´s
   */
  const list = store.get(sessionUuid);
  const listTable = list.reverse().map(item => {
    return '<li><a href="' + ESAPI.encoder().encodeForHTML(item.url) + '">' + ESAPI.encoder().encodeForHTML(item.url) + '</a> ' + item.short + '</li>';
  }).join('\n');

  res.send(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/styles.css">
    <title>Tiny URL</title>
  </head>
  <body class="root">
    <header class="panel header">
      <h1>Short-url</h1>
      <p>Shrink here <a href="https://www.2.se">https://www.2.se</a></p>
    </header>
    <section class="panel panel--light shrink">
      ${newLinkNode}
      <form class="form--shrink" action="/">
        <!-- TODO remove link -->
        <input class="input--shrink" type="text" placeholder="http://url.to/shorten" name="url" />
        <button class="button--shrink" type="submit">shrink !</button>
      </form>
    </section>
    <div class="panel list">
      <ul>${listTable}</ul>
    </div>
  </body>
</html>`);
};

module.exports = page;
