'use strict';

(function () {
  var SORT_TYPES = {
    'recommend': function (array) {
      return array;
    },
    'popular': function (array) {
      return array.sort(function (a, b) {
        return (b.likes - a.likes);
      });
    },
    'discussed': function (array) {
      return array.sort(function (a, b) {
        return (b.comments.length < a.comments.length);
      });
    },
    'random': function (array) {
      return window.utils.getRandomArraySlice(array, array.length);
    }
  };

  var filtersBar = document.body.querySelector('.filters');

  window.initializeListFilters = function (callback, data, renderBlock) {

    filtersBar.classList.remove('hidden');
    var originsData = data.slice();

    var renderPicturesHandler = function (evt) {

      data = sortData(originsData, evt.target.value);
      return callback(renderBlock, data, window.renderPicture);
    };

    var debounceRenderHendler = window.utils.debounce(renderPicturesHandler, 500);
    filtersBar.addEventListener('change', debounceRenderHendler);
  };

  var sortData = function (data, param) {
    var newData = data.slice();
    return SORT_TYPES[param](newData);
  };

})();
