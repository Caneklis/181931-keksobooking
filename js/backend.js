'use strict';
(function () {
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
  var URL_UPLOAD = 'https://js.dump.academy/keksobooking';
  var TIMEOUT = 30000;
  var SUCCESS = 200;
  var BAD_REQUEST_ERROR = 400;
  var NOT_FOUND_ERROR = 404;
  var INTERNAL_SERVER_ERROR = 500;

  var load = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS) {
        onSuccess(xhr.response);
      } else if (xhr.status === NOT_FOUND_ERROR) {
        onError('Ресурс не найден. Ошибка: ' + xhr.status + '' + xhr.statusText);
      } else {
        onError('Неизвестный статус. Ошибка: ' + xhr.status + '' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;
    xhr.open('GET', URL_LOAD);
    xhr.send();
  };

  var upload = function (data, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS) {
        onError('Форма успешно отправлена');
      } else if (xhr.status === BAD_REQUEST_ERROR) {
        onError('Ошибка: ' + xhr.status + '' + xhr.statusText);
      } else if (xhr.status === INTERNAL_SERVER_ERROR) {
        onError('Не удалось загрузить ресурс. Ошибка: ' + xhr.status + '' + xhr.statusText);
      } else {
        onError('Неизвестный статус. Ошибка: ' + xhr.status + '' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;
    xhr.open('POST', URL_UPLOAD);
    xhr.send(data);
  };

  window.backend = {
    upload: upload,
    load: load
  };
})();
