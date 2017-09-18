'use strict';

(function () {

  var SCALE_MIN = 25;
  var SCALE_MAX = 100;
  var SCALE_STEP = 25;

  window.initializeScale = function (elem, callback) {

    elem.addEventListener('click', function (evt) {
      evt.preventDefault();
      var value = parseInt(elem.querySelector('input').scale.value, 10);

      if (evt.target.classList.contains('upload-resize-controls-button-dec')) {
        value -= SCALE_STEP;
        value = Math.max(value, SCALE_MIN);
      } else {
        if (evt.target.classList.contains('upload-resize-controls-button-inc')) {
 +        value += SCALE_STEP;
 +        value = Math.min(value, SCALE_MAX);
 +      }
      }

      elem.querySelector('input').scale.value = value + '%';

      callback(value);

    });

  };

})();
