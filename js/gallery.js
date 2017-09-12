'use strict';

(function () {

  var galleryOverlay = document.querySelector('.gallery-overlay');
  galleryOverlay.setAttribute('tabindex', 0);

  var picturesBlock = document.querySelector('.pictures');

  var galleryOverlayClose = galleryOverlay.querySelector('.gallery-overlay-close');
  galleryOverlayClose.setAttribute('tabindex', 0);

  var renderPictures = function (appendBlock, source, functionRender) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < source.length; i++) {
      if (typeof functionRender === 'function') {
        fragment.appendChild(functionRender(source[i], i));
      }
    }

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

  galleryOverlay.show = function () {
    galleryOverlay.classList.remove('hidden');
    document.addEventListener('keydown', galleryOverlay.onEscPress);
  };

  galleryOverlay.hide = function () {
    galleryOverlay.classList.add('hidden');
    document.removeEventListener('keydown', galleryOverlay.onEscPress);
  };

  var pictures = [];
  var successHendler = function (data) {
    pictures = data;
    renderPictures(picturesBlock, data, window.renderPicture);
  };

  window.backend.load(successHendler, window.utils.errorHandler);


  galleryOverlay.onEscPress = function (evt) {
    window.utils.isEscEvent(evt, galleryOverlay.hide);
  };

  picturesBlock.onPictureClick = function (evt) {
    var target = evt.target;

    evt.preventDefault();

    if (target !== this) {
      var picture = target.closest('.picture');

      var orderPicture = picture.querySelector('img').getAttribute('data-item');

      if (orderPicture >= 0 && orderPicture < pictures.length) {
        window.renderGalleryOverlay(pictures[orderPicture]);
      } else {
        window.renderGalleryOverlay(getPictureData(picture));
      }

      galleryOverlay.show();
    }
  };

  picturesBlock.addEventListener('click', picturesBlock.onPictureClick);

  galleryOverlayClose.addEventListener('click', galleryOverlay.hide);

  galleryOverlayClose.addEventListener('keydown', function (evt) {
    window.utils.isEnterEvent(evt, galleryOverlay.hide);
  });

})();
