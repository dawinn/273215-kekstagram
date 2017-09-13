'use strict';

(function () {

  var picturesBlock = document.querySelector('.pictures');
  var filtersBar = document.body.querySelector('.filters');

  var successHendler = function (data) {
    renderPictures(picturesBlock, data, window.renderPicture);

    picturesBlock.addEventListener('click', function (evt) {
      evt.preventDefault();
      var target = evt.target;

      if (target !== picturesBlock) {
        var picture = target.closest('.picture');
        var orderPicture = picture.querySelector('img').getAttribute('data-item');

        if (orderPicture >= 0 && orderPicture < data.length) {
          window.renderGalleryOverlay(data[orderPicture]);
        } else {
          window.renderGalleryOverlay(getPictureData(picture));
        }

        window.showGalleryOverlay();
      }
    });

    filtersBar.classList.remove('hidden');

    filtersBar.addEventListener('change', function (evt) {
      var newData = dataSort(data, evt.target.value);
      debounce.bind(renderPictures(picturesBlock, newData, window.renderPicture));
    });

  };

  window.backend.load(successHendler, window.utils.errorHandler);

  var renderPictures = function (appendBlock, source, functionRender) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < source.length; i++) {
      if (typeof functionRender === 'function') {
        fragment.appendChild(functionRender(source[i], i));
      }
    }
    appendBlock.textContent = '';
    appendBlock.appendChild(fragment);
  };

  function getPictureData(source) {
    var dataItem = {
      url: source.querySelector('img').getAttribute('src'),
      likes: source.querySelector('.picture-likes').textContent,
      comments: source.querySelector('.picture-comments').textContent
    };
    return dataItem;
  }

  var debounce = function (callback) {
    var DEBOUNCE_INTERVAL = 300;
    var lastTimeout;

    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      callback();
    }, DEBOUNCE_INTERVAL);
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
