'use strict';

(function () {

  var picturesBlock = document.querySelector('.pictures');

  var successHendler = function (data) {
    renderPictures(picturesBlock, data, window.renderPicture);
    window.initializeListFilters(renderPictures, data, picturesBlock);

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

  };

  window.backend.load(successHendler, window.utils.errorHandler);

  var renderPictures = function (appendBlock, source, functionRender) {
    var fragment = document.createDocumentFragment();

    if (Array.isArray(source)) {
      source.forEach(function (item, i) {
        if (typeof functionRender === 'function') {
          fragment.appendChild(functionRender(item, i));
        }
      });
    }

    appendBlock.textContent = '';
    appendBlock.appendChild(fragment);
  };

  var getPictureData = function (source) {
    var dataItem = {
      url: source.querySelector('img').getAttribute('src'),
      likes: source.querySelector('.picture-likes').textContent,
      comments: source.querySelector('.picture-comments').textContent
    };
    return dataItem;
  };
})();
