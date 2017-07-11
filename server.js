'use strict';

const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');

const pageHandler = require('./views/page');

app.use(cookieParser());

app.get('/', pageHandler);

/**
 * Public facing resources
 */
app.use(express.static('static'));

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
