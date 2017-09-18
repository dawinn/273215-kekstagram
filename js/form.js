'use strict';

(function () {

  var SCALE_MIN = 25;
  var SCALE_MAX = 100;
  var SCALE_STEP = 25;

  var DESCRIPTION_MIN = 0;
  var DESCRIPTION_MAX = 140;

  var HASHTAGS_MAX_LENGTH = 20;
  var HASHTAGS_COUNTS = 5;

  var FILE_TYPES = ['image/gif', 'image/jpeg', 'image/png'];

  var uploadForm = document.querySelector('#upload-select-image');
  var uploadImage = uploadForm.querySelector('.upload-image');
  var uploadOverlay = uploadForm.querySelector('.upload-overlay');

  var btnCancelUploadForm = uploadForm.querySelector('.upload-form-cancel');
  btnCancelUploadForm.setAttribute('tabindex', 0);

  var resizeControls = uploadOverlay.querySelector('.upload-resize-controls');

  var previewUploadForm = uploadOverlay.querySelector('.upload-form-preview');

  var effectControls = uploadOverlay.querySelector('.upload-effect-controls');

  var show = function (nameBlock) {
    nameBlock.classList.toggle('hidden', false);
  };

  var hide = function (nameBlock) {
    nameBlock.classList.toggle('hidden', true);
  };

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

  var applyFilterHandler = function (filter, value) {
    previewUploadForm.className = previewUploadForm.classList[0] + ' effect-' + filter;
    previewUploadForm.style.filter = value;
  };

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

  var showError = function (elem, isShow) {
    elem.classList.toggle('upload-message-error', isShow);
  };

  uploadForm.elements.description.validation = function () {
    var valid = true;

    showError(this, false);
    if (this.value.length > DESCRIPTION_MAX || (this.value.length > 0 && this.value.length < DESCRIPTION_MIN)) {
      showError(this, true);
      valid = false;
    }

    return valid;
  };

  uploadForm.elements.scale.validation = function () {
    showError(this, false);

    if (this.value < SCALE_MIN
      || this.value > SCALE_MAX
      || this.value % SCALE_STEP > 0) {
      showError(this, true);
      return false;
    }

    return true;
  };

  uploadForm.elements.hashtags.validation = function () {
    var valid = true;
    var hashArray = [];
    var regex = new RegExp(/([^$A-Za-z0-9А-Яа-я_# ]+)/);

    showError(this, false);
    this.value = this.value.trim();
    this.value = this.value.replace(/(\s\s*)/g, ' ');
    if (this.value.length === 0) {
      return true;
    }

    if (regex.test(this.value)) {
      showError(this, true);
      return false;
    }

    hashArray = this.value.split(' ');
    if (hashArray.length > HASHTAGS_COUNTS) {
      showError(this, true);
      return false;
    }

    var uniq = {};

    valid = !hashArray.some(function (item) {
      if (uniq[item] === 1) {
        return true;
      }
      uniq[item] = 1;
      return (item[0] !== '#' || item.length > HASHTAGS_MAX_LENGTH);
    });

    if (!valid) {
      showError(this, true);
    }

    return valid;
  };

  var submitHandler = function () {
    show(uploadImage);
    hide(uploadOverlay);
    document.removeEventListener('keydown', uploadOverlay.onEscPress);
    uploadForm.reset();
    resetEffect();
  };

  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    var elems = uploadForm.elements;
    elems = Array.prototype.slice.call(elems);
    var valid = elems.reduce(function (validTotal, elem) {
      if (typeof elem.validation === 'function') {
        return elem.validation() && validTotal;
      }
      return validTotal;
    }, true);

    if (valid) {
      window.backend.save(new FormData(uploadForm), submitHandler, window.utils.errorHandler);
    }

  });


})();
