var Clipboard = require('clipboard');

if (Clipboard.isSupported()) {
  new Clipboard('.clipboard-button'); // eslint-disable-line no-new
}
