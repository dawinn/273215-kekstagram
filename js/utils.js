'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  function getRandomItem(array) {
    var index = Math.round(Math.random() * (array.length - 1));
    var item = array[index];
    array.splice(index, 1);
    return item;
  }

  window.utils = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },
    errorHandler: function (errorMessage) {
      var node = document.createElement('div');
      node.classList.add('upload-form-errorMessage');
      node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
      node.style.position = 'absolute';
      node.style.left = 0;
      node.style.right = 0;
      node.style.fontSize = '30px';
      node.style.color = '#fff';

      node.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', node);
    },
    clearErrorMessage: function () {
      var remNode = document.querySelector('.upload-form-errorMessage');

      if (remNode) {
        remNode.parentNode.removeChild(remNode);
      }
    },
    getRandomArraySlice: function (array, length) {
      var newArray = [];
      for (var i = 0; i < length; i++) {
        newArray[i] = getRandomItem(array);
      }

      return newArray;
    },
    debounce: function (func, wait) {
      var timeout = 0;
      return function () {
        var args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          func.apply(null, args);
        }, wait);
      };
    }
  };
})();
