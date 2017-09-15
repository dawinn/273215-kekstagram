'use strict';

(function () {

  var pictureTemplate = document.querySelector('#picture-template').content;

  window.renderPicture = function (picture, index) {
    var pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('img').setAttribute('data-src', picture.url);
    pictureElement.querySelector('img').setAttribute('src', picture.url);
    pictureElement.querySelector('.picture-likes').textContent = picture.likes;
    pictureElement.querySelector('.picture-likes').setAttribute('data-likes', picture.likes);
    pictureElement.querySelector('.picture-comments').textContent = picture.comments.length;
    pictureElement.querySelector('.picture-comments').setAttribute('data-comments', picture.comments.length);

    return pictureElement;
  };

})();
