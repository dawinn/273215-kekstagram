'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var COMMENTS_VARIANTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var picturesCount = 25;

function getRandomNum(min, max) {
  if (min === 'undefined' || max === 'undefined') {
    return 0;
  } else {

    if (min > max) {
      min = min + max;
      max = min - max;
      min = min - max;
    }

  }

  return min + Math.round((max - min) * Math.random());
}

function getRandomItem(array) {
  var index = Math.round(Math.random() * (array.length - 1));
  var item = array[index];
  array.splice(index, 1);
  return item;
}

function getRandomArraySlice(array, length) {
  var newArray = [];
  for (var i = 0; i < length; i++) {
    newArray[i] = getRandomItem(array);
  }

  return newArray;
}

function genPictures(length) {
  var pictures = [];
  var commentsRandomCount;
  var comments;

  for (var i = 0; i < length; i++) {
    commentsRandomCount = getRandomNum(1, COMMENTS_VARIANTS.length - 1);
    comments = COMMENTS_VARIANTS.slice();

    pictures[i] = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomNum(15, 200),
      comments: getRandomArraySlice(comments, commentsRandomCount),
    };
  }

  return pictures;
}

var pictureTemplate = document.querySelector('#picture-template').content;

var galleryOverlay = document.querySelector('.gallery-overlay');
galleryOverlay.setAttribute('tabindex', 0);


var picturesBlock = document.querySelector('.pictures');

var pictures = genPictures(picturesCount);

var galleryOverlayClose = galleryOverlay.querySelector('.gallery-overlay-close');
galleryOverlayClose.setAttribute('tabindex', 0);

var renderPicture = function (picture) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('img').setAttribute('src', picture.url);
  pictureElement.querySelector('.picture-likes').textContent = picture.likes;
  pictureElement.querySelector('.picture-comments').textContent = picture.comments.length;

  return pictureElement;
};

var renderPictures = function (appendBlock, source, functionRender) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < source.length; i++) {
    fragment.appendChild(functionRender(source[i]));
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

function renderGalleryOverlay(source) {
  galleryOverlay.querySelector('.gallery-overlay-image').setAttribute('src', source.url);
  galleryOverlay.querySelector('.likes-count').textContent = source.likes;
  galleryOverlay.querySelector('.comments-count').textContent = source.comments;

}

renderPictures(picturesBlock, pictures, renderPicture);
renderGalleryOverlay(getPictureData(picturesBlock.children[0]));

galleryOverlay.show = function () {
  galleryOverlay.classList.remove('hidden');
  document.addEventListener('keydown', galleryOverlay.onEscPress);
};

galleryOverlay.hide = function () {
  galleryOverlay.classList.add('hidden');
  document.removeEventListener('keydown', galleryOverlay.onEscPress);
};

galleryOverlay.onEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    galleryOverlay.hide();
  }
};

picturesBlock.onPictureClick = function (evt) {
  var target = evt.target;

  evt.preventDefault();

  if (target !== this) {
    var picture = target.closest('.picture');

    renderGalleryOverlay(getPictureData(picture));
    galleryOverlay.show();
  }
};

picturesBlock.addEventListener('click', picturesBlock.onPictureClick);

galleryOverlayClose.addEventListener('click', galleryOverlay.hide);


galleryOverlayClose.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    galleryOverlay.hide();
  }
});

