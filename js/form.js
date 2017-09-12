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

  var uploadForm = document.getElementById('upload-select-image');
  var uploadImage = uploadForm.querySelector('.upload-image');
  var inputFileUploadForm = uploadImage.querySelector('#upload-file');
  var overlayBlockUploadForm = uploadForm.querySelector('.upload-overlay');

  var btnCancelUploadForm = uploadForm.querySelector('.upload-form-cancel');
  btnCancelUploadForm.setAttribute('tabindex', 0);

  var inputDescriptionUploadForm = overlayBlockUploadForm.querySelector('.upload-form-description');
  var inputResizesValue = overlayBlockUploadForm.querySelector('.upload-resize-controls-value');

  var resizeControls = overlayBlockUploadForm.querySelector('.upload-resize-controls');

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
    if (evt.target !== inputDescriptionUploadForm) {
      window.utils.isEscEvent(evt, btnCancelUploadForm.onCancel);
    }
  };

  inputFileUploadForm.addEventListener('change', inputFileUploadForm.onChange);

  btnCancelUploadForm.addEventListener('click', btnCancelUploadForm.onCancel);

  btnCancelUploadForm.addEventListener('keydown', function (evt) {
    window.utils.isEnterEvent(evt, btnCancelUploadForm.onCancel);
  });

  var setScaleHandler = function (scale) {
    previewUploadForm.style.transform = 'scale(' + scale * 0.01 + ')';
    inputResizesValue.value = scale + '%';
  };

  window.initializeScale(resizeControls, setScaleHandler);

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

  uploadForm.onSubmit = function (evt) {

    if (!(inputDescriptionUploadForm.validation() & inputResizesValue.validation() & inputHashTags.validation())) {
      evt.preventDefault();
    }

  };

  btnSubmit.addEventListener('click', uploadForm.onSubmit);

  function applyFilterHandler(filter, value) {
    previewUploadForm.className = previewUploadForm.classList[0] + ' effect-' + filter;
    previewUploadForm.style.filter = value;
  }

  window.initializeFilters(effectControls, applyFilterHandler);

})();
