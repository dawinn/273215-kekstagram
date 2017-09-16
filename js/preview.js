'use strict';

(function () {

  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryOverlayClose = galleryOverlay.querySelector('.gallery-overlay-close');

  galleryOverlay.setAttribute('tabindex', 0);
  galleryOverlayClose.setAttribute('tabindex', 0);

  var onEscPress = function (evt) {
    window.utils.isEscEvent(evt, window.preview.hide);
  };

  window.preview = {
    render: function (source) {
      galleryOverlay.querySelector('.gallery-overlay-image').setAttribute('src', source.url);
      galleryOverlay.querySelector('.likes-count').textContent = source.likes;
      galleryOverlay.querySelector('.comments-count').textContent = source.comments.length;
      galleryOverlay.setAttribute('tabindex', 0);
    },

    hide: function () {
      galleryOverlay.classList.add('hidden');
      document.removeEventListener('keydown', onEscPress);

      galleryOverlayClose.removeEventListener('click', window.preview.hide);
      galleryOverlayClose.removeEventListener('keydown', onEscPress);
    },

    show: function () {
      galleryOverlay.classList.remove('hidden');
      document.addEventListener('keydown', onEscPress);

      galleryOverlayClose.addEventListener('click', window.preview.hide);
      galleryOverlayClose.addEventListener('keydown', onEscPress);
    }
  };
})();
