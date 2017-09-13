'use strict';

(function () {

  var RESIZE = {
    MIN: 25,
    MAX: 100,
    STEP: 25
  };

  window.initializeScale = function (elem, callback) {

    elem.addEventListener('click', function (evt) {
      evt.preventDefault();
      var value = parseInt(elem.getElementsByTagName('input').scale.value, 10);

      if (evt.target.classList.contains('upload-resize-controls-button-dec')) {
        value -= RESIZE.STEP;
        value = Math.max(value, RESIZE.MIN);
      }

      if (evt.target.classList.contains('upload-resize-controls-button-inc')) {
        value += RESIZE.STEP;
        value = Math.min(value, RESIZE.MAX);
      }

      elem.getElementsByTagName('input').scale.value = value + '%';

      callback(value);

    });

  };

})();
