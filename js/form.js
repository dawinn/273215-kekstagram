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
  var uploadOverlay = uploadForm.querySelector('.upload-overlay');

  var btnCancelUploadForm = uploadForm.querySelector('.upload-form-cancel');
  btnCancelUploadForm.setAttribute('tabindex', 0);

  var resizeControls = uploadOverlay.querySelector('.upload-resize-controls');

  var previewUploadForm = uploadOverlay.querySelector('.upload-form-preview');

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
    var inputDescriptionUploadForm = uploadOverlay.querySelector('.upload-form-description');

    if (evt.target !== inputDescriptionUploadForm) {
      window.utils.isEscEvent(evt, onCancel);
    }
  };

  uploadForm.elements.filename.addEventListener('change', function (evt) {
    var file = evt.target.files[0];
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
    var inputResizesValue = uploadOverlay.querySelector('.upload-resize-controls-value');

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
    previewUploadForm.className = previewUploadForm.classList[0];
    previewUploadForm.style = '';
    var levelEffectBar = effectControls.querySelector('.upload-effect-level');
    if (!levelEffectBar.classList.contains('hidden')) {
      levelEffectBar.classList.add('hidden');
    }
    window.utils.clearErrorMessage();
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

  uploadForm.elements.description.validation = function () {
    var valid = true;

    resetError(this);
    if (this.value.length > 0 && this.value.length < DESCRIPTION.MIN) {
      showError(this);
      valid = false;
    } else {
      if (this.value.length > DESCRIPTION.MAX) {
        showError(this);
        valid = false;
      }
    }

    return valid;
  };

  uploadForm.elements.scale.validation = function () {
    resetError(this);

    if (this.value < RESIZE.MIN
      || this.value > RESIZE.MAX
      || this.value % RESIZE.STEP > 0) {
      showError(this);
      return false;
    }

    return true;
  };

  uploadForm.elements.hashtags.validation = function () {
    var valid = true;
    var hashArray = [];
    var regex = new RegExp(/([^$A-Za-z0-9А-Яа-я_# ]+)/);

    resetError(this);
    if (this.value.length === 0) {
      return valid;
    }

    if (regex.test(this.value)) {
      showError(this);
      valid = false;
    } else {
      hashArray = this.value.split(' ');
      if (hashArray.length !== 0) {
        if (hashArray.length > HASHTAGS.COUNTS) {
          showError(this);
          valid = false;
        } else {

          var obj = {};

          for (var i = 0; i < hashArray.length; i++) {
            if (hashArray[i][0] !== '#' || hashArray[i].length > HASHTAGS.MAX_LENGTH) {
              showError(this);
              valid = false;
              break;
            }
            obj[hashArray[i]] = 1;
          }

          if (Object.keys(obj).length !== hashArray.length) {
            showError(this);
            valid = false;
          }
        }
      }
    }

    return valid;
  };

  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    function submitHandler() {
      show(uploadImage);
      hide(uploadOverlay);
      document.removeEventListener('keydown', uploadOverlay.onEscPress);
      uploadForm.reset();
      resetEffect();
    }

    var elem = uploadForm.elements;
    var valid = true;
    for (var i = 0; i < elem.length; i++) {
      if (typeof elem[i].validation === 'function') {
        valid = elem[i].validation() && valid;
      }
    }

    if (valid) {
      window.backend.save(new FormData(uploadForm), submitHandler, window.utils.errorHandler);
    }

  });


})();
