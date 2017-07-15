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
  let listTable = list.reverse().map((item, index) => {
    return `
<li class="list-item">
  <div class="list-url">
    <a class="list-url__short" id="copytarget${index}" href="${item.short}">${item.short}</a>
    <a class="list-url__long" href="${ESAPI.encoder().encodeForHTML(item.url)}">${ESAPI.encoder().encodeForHTML(item.url)}</a>
  </div>
  <button class="button button--copy text-hidden clipboard-button" data-clipboard-target="#copytarget${index}">
    copy link to clipboard
    <svg class="icon icon--copy" height="1024" width="896" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 896 1024">
      <path d="M704 896h-640v-576h640v192h64v-320c0-35-29-64-64-64h-192c0-71-57-128-128-128s-128 57-128 128h-192c-35 0-64 29-64 64v704c0 35 29 64 64 64h640c35 0 64-29 64-64v-128h-64v128z m-512-704c29 0 29 0 64 0s64-29 64-64 29-64 64-64 64 29 64 64 32 64 64 64 33 0 64 0 64 29 64 64h-512c0-39 28-64 64-64z m-64 512h128v-64h-128v64z m448-128v-128l-256 192 256 192v-128h320v-128h-320z m-448 256h192v-64h-192v64z m320-448h-320v64h320v-64z m-192 128h-128v64h128v-64z" />
    </svg>
  </button>
</li>
    `;
  }).join('\n');

  listTable = listTable ? '<h2 class="header header--links">Your latest short-links</h2><ul class="list">' + listTable + '</ul>' : '';

  res.send(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/styles.css">
    <title>Tiny URL</title>
  </head>
  <body class="root">
    <header class="panel header">
      <h1><a href="/">Short-url</a></h1>
      <p>Shrink here <a href="https://www.2.se">https://www.2.se</a></p>
    </header>
    <section class="panel panel--light shrink">
      ${newLinkNode}
      <form class="form--shrink" action="/">
        <input class="input--shrink" type="text" placeholder="http://url.to/shorten" name="url" />
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
