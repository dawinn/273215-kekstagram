'use strict';

(function () {

  var PICTURES_COUNT = 25;

  var COMMENTS_VARIANTS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  var COMMENTS_MIN = 15;
  var COMMENTS_MAX = 200;

  var getRandomNum = function (min, max) {
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
  };

  window.getData = function (length) {
    var pictures = [];
    var commentsRandomCount;
    var comments;

    for (var i = 0; i < length; i++) {
      commentsRandomCount = getRandomNum(1, COMMENTS_VARIANTS.length - 1);
      comments = COMMENTS_VARIANTS.slice();

      pictures[i] = {
        url: 'photos/' + (i + 1) + '.jpg',
        likes: getRandomNum(COMMENTS_MIN, COMMENTS_MAX),
        comments: window.utils.getRandomArraySlice(comments, commentsRandomCount),
      };
    }

    return pictures;
  }(PICTURES_COUNT);

})();
