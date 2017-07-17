'use strict';

const validate = require('validate.js');
const ESAPI = require('node-esapi');

const session = require('../utils/session');
const store = require('../utils/store');
const partialShortend = require('./partials/shortend');

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
    const isBadUrl = validate({website: queryUrl}, {
      website: {
        url: {
          allowLocal: true
        }
      }
    });

    if (!isBadUrl) { // undefined if green-lighted
      newLink = store.set(queryUrl, sessionUuid);
      newLinkNode = partialShortend.render([newLink]);
      newLinkNode = newLinkNode ? `<p class="message">Here is your new short-link</p>${newLinkNode}` : '';
    } else {
      newLinkNode = `<div class="message"><p>Opps, was that the correct link?</p><p>${ESAPI.encoder().encodeForHTML(queryUrl)}</p></div>`;
    }
  }

  /**
   * Lists current user´s short-url´s
   */
  const list = store.get(sessionUuid);
  let listTable = partialShortend.render(list);
  listTable = listTable ? '<h2 class="header header--links">Your latest short-links</h2>' + listTable : '';

  /**
   * Off we go - send result
   */
  res.send(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/styles.css">
    <title>Tiny URL</title>
  </head>
  <body class="root">
    <header class="panel masthead">
      <h1 class="home"><a href="/">Short url</a></h1>
      <div class="splash">http://short.link/<span class="splash__text">is/so/much/better<span></div>
    </header>
    <section class="panel panel--light shrink">
      ${newLinkNode}
      <form class="form--shrink" action="/">
        <input class="input--shrink" type="text" placeholder="http://url.to/shorten" name="url" autofocus />
        <button class="button button--shrink" type="submit">shrink !</button>
      </form>
    </section>
    <section class="panel links">
      ${listTable}
    </section>
    <script src="/scripts.js" async></script>
  </body>
</html>`);
};

module.exports = page;
