var Clipboard = require('clipboard');

var btnAnimationListener = function (e) {
  e.target.classList.remove('button--ok');
};

if (Clipboard.isSupported()) {
  var clipboard = new Clipboard('.clipboard-button'); // eslint-disable-line no-new

  clipboard.on('success', function (e) {
    e.trigger.classList.add('button--ok');
    e.trigger.addEventListener('animationend', btnAnimationListener, false);
    e.clearSelection();
  });
}
