'use strict';

require('dotenv').load();

const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');

const pageHandler = require('./views/page');
const resolveHandler = require('./views/resolve');

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
  var host = server.address().address;
  var port = server.address().port;
  console.log('running at http://' + host + ':' + port + ' (configurable in .env)');
});
