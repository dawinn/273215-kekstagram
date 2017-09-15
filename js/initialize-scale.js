'use strict';

(function () {

  var RESIZE_MIN = 25;
  var RESIZE_MAX = 100;
  var RESIZE_STEP = 25;

  window.initializeScale = function (elem, callback) {

    elem.addEventListener('click', function (evt) {
      evt.preventDefault();
      var value = parseInt(elem.querySelector('input').scale.value, 10);

      if (evt.target.classList.contains('upload-resize-controls-button-dec')) {
        value -= RESIZE_STEP;
        value = Math.max(value, RESIZE_MIN);
      }

      if (evt.target.classList.contains('upload-resize-controls-button-inc')) {
        value += RESIZE_STEP;
        value = Math.min(value, RESIZE_MAX);
      }

      elem.querySelector('input').scale.value = value + '%';

      callback(value);

    });

  };

})();
