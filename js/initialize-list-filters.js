'use strict';

(function () {
  var filtersBar = document.body.querySelector('.filters');

  window.initializeListFilters = function (callback, data, renderBlock) {

    filtersBar.classList.remove('hidden');

    var renderPicturesHandler = function (evt) {
      var newData;
      newData = dataSort(data, evt.target.value);
      return callback(renderBlock, newData, window.renderPicture);
    };

    var debounceSet = window.utils.debounce(renderPicturesHandler, 500);
    filtersBar.addEventListener('change', debounceSet);
  };

  var dataSort = function (data, param) {
    var newData = data.slice();
    switch (param) {
      case 'popular':
        return newData.sort(function (a, b) {
          return (a.likes < b.likes ? 1 : -1);
        });
      case 'discussed':
        return newData.sort(function (a, b) {
          return (a.comments.length < b.comments.length ? 1 : -1);
        });
      case 'random':
        return window.utils.getRandomArraySlice(newData, newData.length);
      default:
        return newData;
    }
  };

})();
