'use strict';

(function () {

  var effectControlsData = {
    VALUE_DEFAULT: 20,
    value: 20,
    chosenFilter: '',
    FILTER_TYPES: {
      'chrome': function () {
        return 'filter: grayscale(' + effectControlsData.value / 100 + ')';
      },

      'sepia': function () {
        return 'filter: sepia(' + effectControlsData.value / 100 + ')';
      },

      'marvin': function () {
        return 'filter: invert(' + effectControlsData.value + '%)';
      },

      'phobos': function () {
        return 'filter: blur(' + Math.round(effectControlsData.value * 0.03) + 'px)';
      },

      'heat': function () {
        return 'filter: brightness(' + effectControlsData.value * 0.03 + ')';
      }
    }
  };

  window.initializeFilters = function (elem, callback) {
    var pin = elem.querySelector('.upload-effect-level-pin');
    var val = elem.querySelector('.upload-effect-level-val');


    function setPinPosition(value) {
      pin.style.left = value + '%';
      val.style.width = value + '%';
    }

    elem.addEventListener('change', function (evt) {
      setEffectType(evt.target.value);
    });


    var setEffectType = function (value) {
      effectControlsData.chosenFilter = value;
      effectControlsData.value = effectControlsData.VALUE_DEFAULT;
      if (value === 'none') {
        pin.closest('.upload-effect-level').classList.add('hidden');
        callback('', '');
      } else {
        pin.closest('.upload-effect-level').classList.remove('hidden');
        setPinPosition(effectControlsData.value);
        callback(value, effectControlsData.FILTER_TYPES[effectControlsData.chosenFilter]());
      }
    };

    var setEffectValue = function (value) {
      effectControlsData.value = value;
      setPinPosition(value);
      callback(effectControlsData.chosenFilter, effectControlsData.FILTER_TYPES[effectControlsData.chosenFilter]());
    };

    pin.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      var startCoords = {
        x: evt.clientX
      };

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        var shift = {
          x: startCoords.x - moveEvt.clientX
        };

        startCoords = {
          x: moveEvt.clientX
        };

        setEffectValue(Math.max(0, Math.min(100, Math.round((pin.offsetLeft - shift.x)) / 4.55)));
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });


  };


})();
