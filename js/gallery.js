'use strict';

(function () {

  var picturesBlock = document.querySelector('.pictures');

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

    window.initializeListFilters(renderPictures, data, picturesBlock);

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
})();
