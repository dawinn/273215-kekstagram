'use strict';

var KEYCODE = {
  ESC: 27,
  ENTER: 13
};

var RESIZE = {
  MIN: 25,
  MAX: 100,
  STEP: 25
};

var DESCRIPTION = {
  MIN: 30,
  MAX: 100,
};

var COMMENTS = {
  MIN: 15,
  MAX: 200
};

var HASHTAGS = {
  MAX_LENGTH: 20,
  COUNTS: 5
};

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
      likes: getRandomNum(COMMENTS.MIN, COMMENTS.MAX),
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

var renderPicture = function (picture, index) {
  var pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('img').setAttribute('data-item', index);
  pictureElement.querySelector('img').setAttribute('src', picture.url);
  pictureElement.querySelector('.picture-likes').textContent = picture.likes;
  pictureElement.querySelector('.picture-comments').textContent = picture.comments.length;

  return pictureElement;
};

var renderPictures = function (appendBlock, source, functionRender) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < source.length; i++) {
    fragment.appendChild(functionRender(source[i], i));
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
  galleryOverlay.querySelector('.comments-count').textContent = source.comments.length;

}

renderPictures(picturesBlock, pictures, renderPicture);
renderGalleryOverlay(pictures[0]);

galleryOverlay.show = function () {
  galleryOverlay.classList.remove('hidden');
  document.addEventListener('keydown', galleryOverlay.onEscPress);
};

galleryOverlay.hide = function () {
  galleryOverlay.classList.add('hidden');
  document.removeEventListener('keydown', galleryOverlay.onEscPress);
};

galleryOverlay.onEscPress = function (evt) {
  if (evt.keyCode === KEYCODE.ESC) {
    galleryOverlay.hide();
  }
};

picturesBlock.onPictureClick = function (evt) {
  var target = evt.target;

  evt.preventDefault();

  if (target !== this) {
    var picture = target.closest('.picture');

    var orderPicture = picture.querySelector('img').getAttribute('data-item');

    if (orderPicture >= 0 && orderPicture < pictures.length) {
      renderGalleryOverlay(pictures[orderPicture]);
    } else {
      renderGalleryOverlay(getPictureData(picture));
    }

    galleryOverlay.show();
  }
};

picturesBlock.addEventListener('click', picturesBlock.onPictureClick);

galleryOverlayClose.addEventListener('click', galleryOverlay.hide);


galleryOverlayClose.addEventListener('keydown', function (evt) {
  if (evt.keyCode === KEYCODE.ENTER) {
    galleryOverlay.hide();
  }
});


// upload form

var uploadForm = document.getElementById('upload-select-image');
var uploadImage = uploadForm.querySelector('.upload-image');
var inputFileUploadForm = uploadImage.querySelector('#upload-file');
var overlayBlockUploadForm = uploadForm.querySelector('.upload-overlay');

var btnCancelUploadForm = uploadForm.querySelector('.upload-form-cancel');
btnCancelUploadForm.setAttribute('tabindex', 0);

var inputDescriptionUploadForm = overlayBlockUploadForm.querySelector('.upload-form-description');
var inputResizesValue = overlayBlockUploadForm.querySelector('.upload-resize-controls-value');
var btnResizeControlsDec = overlayBlockUploadForm.querySelector('.upload-resize-controls-button-dec');
var btnResizeControlsInc = overlayBlockUploadForm.querySelector('.upload-resize-controls-button-inc');
var previewUploadForm = overlayBlockUploadForm.querySelector('.upload-form-preview');
var inputHashTags = overlayBlockUploadForm.querySelector('.upload-form-hashtags');
var btnSubmit = uploadForm.querySelector('.upload-form-submit');
var effectControls = overlayBlockUploadForm.querySelector('.upload-effect-controls');

var show = function (nameBlock) {
  if (nameBlock.classList.contains('hidden')) {
    nameBlock.classList.remove('hidden');
  }
};

var hide = function (nameBlock) {
  if (!nameBlock.classList.contains('hidden')) {
    nameBlock.classList.add('hidden');
  }
};

inputFileUploadForm.onChange = function (evt) {
  hide(uploadImage);
  show(overlayBlockUploadForm);
  document.addEventListener('keydown', overlayBlockUploadForm.onEscPress);
};

btnCancelUploadForm.onCancel = function () {
  show(uploadImage);
  hide(overlayBlockUploadForm);
  document.removeEventListener('keydown', overlayBlockUploadForm.onEscPress);
};

overlayBlockUploadForm.onEscPress = function (evt) {
  if (evt.keyCode === KEYCODE.ESC && evt.target !== inputDescriptionUploadForm) {
    btnCancelUploadForm.onCancel();
  }
};

inputFileUploadForm.addEventListener('change', inputFileUploadForm.onChange);

btnCancelUploadForm.addEventListener('click', btnCancelUploadForm.onCancel);

btnCancelUploadForm.addEventListener('keydown', function (evt) {
  if (evt.keyCode === KEYCODE.ENTER) {
    btnCancelUploadForm.onCancel();
  }
});


uploadForm.valid = false;

btnResizeControlsDec.addEventListener('click', function (evt) {
  var value = parseInt(inputResizesValue.value, 10) - RESIZE.STEP;
  value = (value < RESIZE.MIN ? RESIZE.MIN : value);
  inputResizesValue.value = value + '%';
  previewUploadForm.style = 'transform: scale(' + value * 0.01 + ')';
});

btnResizeControlsInc.addEventListener('click', function (evt) {
  var value = parseInt(inputResizesValue.value, 10) + RESIZE.STEP;
  value = (value >= RESIZE.MAX ? RESIZE.MAX : value);
  inputResizesValue.value = value + '%';
  previewUploadForm.style = 'transform: scale(' + value * 0.01 + ')';
});

effectControls.addEventListener('change', function (evt) {
  previewUploadForm.className = previewUploadForm.classList[0] + ' effect-' + evt.target.value;
});

function showError(elem) {
  if (!elem.classList.contains('upload-message-error')) {
    elem.classList.add('upload-message-error');
  }
  uploadForm.valid = false;
}

function resetError(elem) {
  if (elem.classList.contains('upload-message-error')) {
    elem.classList.remove('upload-message-error');
  }
  uploadForm.valid = true;
}

uploadForm.validation = function () {
  var hashArray = [];

  resetError(inputDescriptionUploadForm);
  if (inputDescriptionUploadForm.value.length < DESCRIPTION.MIN) {
    showError(inputDescriptionUploadForm);
  } else {
    if (inputDescriptionUploadForm.value.length > DESCRIPTION.MAX) {
      showError(inputDescriptionUploadForm);
    }
  }

  resetError(inputResizesValue);
  if (inputResizesValue.value < RESIZE.MIN
    || inputResizesValue.value > RESIZE.MAX
    || inputResizesValue.value % RESIZE.STEP > 0) {

    showError(inputResizesValue);
  }

  resetError(inputHashTags);
  var regex = new RegExp(/([^$A-Za-z0-9А-Яа-я_# ]+)/);

  if (regex.test(inputHashTags.value)) {
    showError(inputHashTags);
  } else {
    hashArray = inputHashTags.value.split(' ');
    if (hashArray.length !== 0) {
      if (hashArray.length > HASHTAGS.COUNTS) {
        showError(inputHashTags);
      } else {

        var obj = {};

        for (var i = 0; i < hashArray.length; i++) {
          if (hashArray[i][0] !== '#' || hashArray[i].length > HASHTAGS.MAX_LENGTH) {
            showError(inputHashTags);
            break;
          }
          obj[hashArray[i]] = 1;
        }

        if (Object.keys(obj).length !== hashArray.length) {
          showError(inputHashTags);
        }

      }
    }
  }

  return uploadForm.valid;
};

uploadForm.onSubmit = function (evt) {

  if (!uploadForm.validation()) {
    evt.preventDefault();
  }

};

btnSubmit.addEventListener('click', uploadForm.onSubmit);
