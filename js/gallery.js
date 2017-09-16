'use strict';

(function () {
  var picturesBlock = document.querySelector('.pictures');

  var successHendler = function (data) {
    renderPictures(picturesBlock, data, window.renderPicture);
    window.initializeListFilters(renderPictures, data, picturesBlock);

    picturesBlock.addEventListener('click', function (evt) {
      evt.preventDefault();
      var target = evt.target;

      if (target !== picturesBlock) {
        var picture = target.closest('.picture');
        window.preview.render(getPictureData(picture));
        window.preview.show();
      }
    });

  };

  window.backend.load(successHendler, window.utils.errorHandler);

  var renderPictures = function (appendBlock, source, functionRender) {
    var fragment = document.createDocumentFragment();

    if (Array.isArray(source)) {
      source.forEach(function (item, i) {
        fragment.appendChild(functionRender(item, i));
      });
    }

    appendBlock.textContent = '';
    appendBlock.appendChild(fragment);
  };

  var getPictureData = function (source) {
    var dataItem = {
      url: source.querySelector('img').getAttribute('data-src'),
      likes: source.querySelector('.picture-likes').getAttribute('data-likes'),
      comments: source.querySelector('.picture-comments').getAttribute('data-comments')
    };
    return dataItem;
  };

})();
