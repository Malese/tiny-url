'use strict';

require('dotenv').load();

const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');

const store = require('./utils/store');
const session = require('./utils/session');
const pageHandler = require('./views/page');
const resolveHandler = require('./views/resolve');

const serverUrl = 'http://' + (process.env.HOSTNAME || '127.0.0.1') + ':' + (process.env.PORT || 3000);

/**
 * Get session initialized
 */
session.init({
  hostname: process.env.HOSTNAME || '127.0.0.1',
  name: 'tiny-ident'
});

/**
 * Get store initialized
 */
store.init({
  serverUrl: serverUrl,
  alphabet: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
});

/**
 * Use a ./.env file if needed
 */
app.set('port', process.env.PORT || 3000);
app.set('hostname', process.env.HOSTNAME || '127.0.0.1');

/**
 * We must handle /ABC and /abc as different req´s
 */
app.set('case sensitive routing', true);

app.use(cookieParser());

/**
 * Resolve route
 */
app.get('/:url', resolveHandler);

/**
 * Main app route
 */
app.get('/', pageHandler);

/**
 * Public facing resources.
 * CSS, JS, graphics etc.
 */
app.use(express.static('static'));

/**
 * Fallback/404 route
 */
app.get('*', (req, res, next) => {
  res.status(404).send('Ops, not found (404)');
});

const server = app.listen(app.get('port'), app.get('hostname'), () => {
  const host = server.address().address || '[NOT SET]';
  const port = server.address().port || '[NOT SET]';
  console.log('running at http://' + host + ':' + port + ' (configurable in .env)'); // eslint-disable-line no-console
});
