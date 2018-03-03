'use strict';

(function () {
  var DEBOUNCE_TIME = 500;
  var ERROR_MESSAGE_TIME = 5000;
  /**
   * Функция генерации случайного числа
   * @param   {number} min Минимальное значение
   * @param   {number} max Максимальное знаение
   * @return {number} возвращает число
   */
  var getRandomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };

  /**
   * Функция генерации рандомного элемента массива
   * @param   {number} array Массив
   * @return {number} Номер элемента из массива
   */
  var getRandomItem = function (array) {
    return array[getRandomNumber(0, array.length - 1)];
  };

  /**
   * Функция перемешивания массива
   * @param   {Array} array
   * @return {Array}
   */
  var shuffleArray = function (array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  var roomType = function (russianRoomType) {
    var roomTypes = {
      flat: 'Квартира',
      bungalo: 'Бунгало',
      house: 'Дом'
    };
    return roomTypes[russianRoomType];
  };

  /**
   * Функция отрисовки окна с ошибкой
   * @param {string} errorMessage
   */
  var showErrorMessage = function (errorMessage) {
    var errorPopup = document.createElement('div');
    var message = document.createElement('p');
    errorPopup.style.position = 'absolute';
    errorPopup.style.top = '0';
    errorPopup.style.left = '0';
    errorPopup.style.width = '100%';
    errorPopup.style.margin = '0 auto';
    errorPopup.style.backgroundColor = 'rgba(255,255,255,0.7)';
    errorPopup.style.color = 'rgb(249,79,0)';
    errorPopup.style.fontSize = '30px';
    errorPopup.style.padding = '50px';
    errorPopup.style.border = '1px solid rgb(249,79,0)';
    errorPopup.style.zIndex = '100';
    errorPopup.style.textAlign = 'center';
    message.textContent = errorMessage;
    errorPopup.appendChild(message);
    document.body.appendChild(errorPopup);

    setTimeout(function () {
      errorPopup.style.display = 'none';
    }, ERROR_MESSAGE_TIME);
  };

  var lastTimeout;

  /**
  * Функция устранения дребезга
  * @param {string} action
  */
  var debounce = function (action) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(action, DEBOUNCE_TIME);
  };

  window.utils = {
    getRandomNumber: getRandomNumber,
    getRandomItem: getRandomItem,
    shuffleArray: shuffleArray,
    roomType: roomType,
    debounce: debounce,
    showError: showErrorMessage
  };
})();
