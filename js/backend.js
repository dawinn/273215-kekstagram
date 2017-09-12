'use strict';

(function () {
  var SERVER_URL = 'https://1510.dump.academy/kekstagram';

  var setup = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        switch (xhr.status) {
          case 401:
            onError('Неверный запрос' + xhr.responseURL);
            break;
          case 403:
            onError('Доступ запрещен');
            break;
          case 404:
            onError('Несуществующий адрес обращения: ' + xhr.responseURL);
            break;
          case 500:
            onError('Внутренняя ошибка сервера');
            break;
          default:
            onError(xhr.status + ' ' + xhr.statusText);
        }
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000; // 10s

    return xhr;
  };


  window.backend = {
    load: function (onLoad, onError) {
      var xhr = setup(onLoad, onError);

      xhr.open('GET', SERVER_URL + '/data');
      xhr.send();
    },
    save: function (data, onLoad, onError) {
      var xhr = setup(onLoad, onError);

      xhr.open('POST', SERVER_URL);
      xhr.send(data);
    }
  };

})();
