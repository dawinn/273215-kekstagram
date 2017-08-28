// stats.js
'use strict';

var COMMENTS_VARIANTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var picturesCount = 25;

function genPictures(length) {
  var pictures = [];
  var comments = COMMENTS_VARIANTS.slice();
  var indexRandomOfComments;

  for (var i = 0; i < length; i++) {
    indexRandomOfComments = Math.round((comments.length - 1) * Math.random());

    pictures[i] = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: Math.round(15 + 185 * Math.random()),
      comments: comments.slice(indexRandomOfComments, indexRandomOfComments + (1 + Math.round(Math.random())))
    };
  }

  return pictures;
}

var pictureTemplate = document.querySelector('#picture-template').content;

var formUploadOverlay = document.querySelector('.upload-overlay');

var galleryOverlay = document.querySelector('.gallery-overlay');

var picturesBlock = document.querySelector('.pictures');

var pictures = genPictures(picturesCount);

var renderPicture = function (picture) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('img').setAttribute('src', picture.url);
  pictureElement.querySelector('.picture-likes').textContent = picture.likes;
  pictureElement.querySelector('.picture-comments').textContent = picture.comments;

  return pictureElement;
};

var renderPictures = function (appendBlock, source, functionRender) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < source.length; i++) {
    fragment.appendChild(functionRender(source[i]));
  }

  appendBlock.appendChild(fragment);

};

function genGalleryOverlay(source) {
  galleryOverlay.querySelector('.gallery-overlay-image').setAttribute('src', source.url);
  galleryOverlay.querySelector('.likes-count').textContent = source.likes;
  galleryOverlay.querySelector('.comments-count').textContent = source.comments.length;

}

formUploadOverlay.classList.add('hidden');

renderPictures(picturesBlock, pictures, renderPicture);
genGalleryOverlay(pictures[0]);

galleryOverlay.classList.remove('hidden');
