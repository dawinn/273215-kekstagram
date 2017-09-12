'use strict';

(function () {

  var RESIZE = {
    MIN: 25,
    MAX: 100,
    STEP: 25
  };

  var DESCRIPTION = {
    MIN: 0,
    MAX: 140,
  };

  var HASHTAGS = {
    MAX_LENGTH: 20,
    COUNTS: 5
  };

  var FILE_TYPES = ['image/gif', 'image/jpeg', 'image/png'];

  var uploadForm = document.getElementById('upload-select-image');
  var uploadImage = uploadForm.querySelector('.upload-image');
  var inputFileUploadForm = uploadImage.querySelector('#upload-file');
  var uploadOverlay = uploadForm.querySelector('.upload-overlay');

  var btnCancelUploadForm = uploadForm.querySelector('.upload-form-cancel');
  btnCancelUploadForm.setAttribute('tabindex', 0);

  var inputDescriptionUploadForm = uploadOverlay.querySelector('.upload-form-description');
  var inputResizesValue = uploadOverlay.querySelector('.upload-resize-controls-value');

  var resizeControls = uploadOverlay.querySelector('.upload-resize-controls');

  var previewUploadForm = uploadOverlay.querySelector('.upload-form-preview');
  var inputHashTags = uploadOverlay.querySelector('.upload-form-hashtags');

  var effectControls = uploadOverlay.querySelector('.upload-effect-controls');

  function show(nameBlock) {
    if (nameBlock.classList.contains('hidden')) {
      nameBlock.classList.remove('hidden');
    }
  }

  function hide(nameBlock) {
    if (!nameBlock.classList.contains('hidden')) {
      nameBlock.classList.add('hidden');
    }
  }

  var onCancel = function () {
    show(uploadImage);
    hide(uploadOverlay);
    document.removeEventListener('keydown', uploadOverlay.onEscPress);
    uploadForm.reset();
    resetEffect();
  };

  uploadOverlay.onEscPress = function (evt) {
    if (evt.target !== inputDescriptionUploadForm) {
      window.utils.isEscEvent(evt, onCancel);
    }
  };

  inputFileUploadForm.addEventListener('change', function (evt) {
    var file = inputFileUploadForm.files[0];
    resetEffect();
    if (FILE_TYPES.some(function (item) {
      return file.type === item;
    })) {
      hide(uploadImage);
      show(uploadOverlay);
      document.addEventListener('keydown', uploadOverlay.onEscPress);
    } else {
      window.utils.errorHandler('Тип файла отличен от допустимых: gif, jpeg, png');
      uploadForm.reset();
    }
  });

  btnCancelUploadForm.addEventListener('click', onCancel);

  btnCancelUploadForm.addEventListener('keydown', function (evt) {
    window.utils.isEnterEvent(evt, onCancel);
  });

  var setScaleHandler = function (scale) {
    previewUploadForm.style.transform = 'scale(' + scale * 0.01 + ')';
    inputResizesValue.value = scale + '%';
  };

  window.initializeScale(resizeControls, setScaleHandler);

  function applyFilterHandler(filter, value) {
    previewUploadForm.className = previewUploadForm.classList[0] + ' effect-' + filter;
    previewUploadForm.style.filter = value;
  }

  window.initializeFilters(effectControls, applyFilterHandler);

  var resetEffect = function () {
    window.initializeScale(resizeControls, setScaleHandler);
    window.initializeFilters(effectControls, applyFilterHandler);
    var remNode = document.querySelector('.upload-form-errorMessage');

    if (remNode) {
      remNode.parentNode.removeChild(remNode);
    }
  };

  function showError(elem) {
    if (!elem.classList.contains('upload-message-error')) {
      elem.classList.add('upload-message-error');
    }
  }

  function resetError(elem) {
    if (elem.classList.contains('upload-message-error')) {
      elem.classList.remove('upload-message-error');
    }
  }

  inputDescriptionUploadForm.validation = function () {
    var valid = true;

    resetError(inputDescriptionUploadForm);
    if (inputDescriptionUploadForm.value.length > 0 && inputDescriptionUploadForm.value.length < DESCRIPTION.MIN) {
      showError(inputDescriptionUploadForm);
      valid = false;
    } else {
      if (inputDescriptionUploadForm.value.length > DESCRIPTION.MAX) {
        showError(inputDescriptionUploadForm);
        valid = false;
      }
    }

    return valid;
  };

  inputResizesValue.validation = function () {
    resetError(inputResizesValue);

    if (inputResizesValue.value < RESIZE.MIN
      || inputResizesValue.value > RESIZE.MAX
      || inputResizesValue.value % RESIZE.STEP > 0) {
      showError(inputResizesValue);
      return false;
    }

    return true;
  };

  inputHashTags.validation = function () {
    var valid = true;
    var hashArray = [];
    var regex = new RegExp(/([^$A-Za-z0-9А-Яа-я_# ]+)/);

    resetError(inputHashTags);
    if (inputHashTags.value.length === 0) {
      return valid;
    }

    if (regex.test(inputHashTags.value)) {
      showError(inputHashTags);
      valid = false;
    } else {
      hashArray = inputHashTags.value.split(' ');
      if (hashArray.length !== 0) {
        if (hashArray.length > HASHTAGS.COUNTS) {
          showError(inputHashTags);
          valid = false;
        } else {

          var obj = {};

          for (var i = 0; i < hashArray.length; i++) {
            if (hashArray[i][0] !== '#' || hashArray[i].length > HASHTAGS.MAX_LENGTH) {
              showError(inputHashTags);
              valid = false;
              break;
            }
            obj[hashArray[i]] = 1;
          }

          if (Object.keys(obj).length !== hashArray.length) {
            showError(inputHashTags);
            valid = false;
          }

        }
      }
    }

    return valid;
  };

  // обработчик нажатия кнопки Отправить
  uploadForm.addEventListener('submit', function (evt) {

    function submitHandler() {
      show(uploadImage);
      hide(uploadOverlay);
      document.removeEventListener('keydown', uploadOverlay.onEscPress);
      uploadForm.reset();
      resetEffect();
    }

    if (!(inputDescriptionUploadForm.validation() & inputResizesValue.validation() & inputHashTags.validation())) {
      evt.preventDefault();
    } else {

      window.backend.save(new FormData(uploadForm), submitHandler, window.utils.errorHandler);
    }

  });


})();
