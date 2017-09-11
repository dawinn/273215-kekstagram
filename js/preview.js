'use strict';

(function () {

  var galleryOverlay = document.querySelector('.gallery-overlay');

  window.renderGalleryOverlay = function (source) {
    galleryOverlay.querySelector('.gallery-overlay-image').setAttribute('src', source.url);
    galleryOverlay.querySelector('.likes-count').textContent = source.likes;
    galleryOverlay.querySelector('.comments-count').textContent = source.comments.length;
    galleryOverlay.setAttribute('tabindex', 0);
  };

})();
