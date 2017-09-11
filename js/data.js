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

  var COMMENTS = {
    MIN: 15,
    MAX: 200
  };

  window.data = function (length) {
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
  }(PICTURES_COUNT);

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


})();