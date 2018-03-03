'use strict';

(function () {
  var BUTTON_WIDTH = 50;
  var BUTTON_HEIGHT = 70;
  var PINS_QUANTITY = 5;

  /**
   * Функция создания DOM-элементов меткок на карте
   * @param {Array} pins массив пинов
   */
  var createButtons = function (pins) {
    var mapPins = document.querySelector('.map__pins');
    var buttons = document.createDocumentFragment();
    for (var i = 0; i < pins.length && i < PINS_QUANTITY; i++) {
      var positionX = pins[i].location.x + BUTTON_WIDTH / 2;
      var positionY = pins[i].location.y + BUTTON_HEIGHT / 2;
      var button = document.createElement('button');
      button.setAttribute('data-id', i);
      button.className = 'map__pin';
      button.style = 'left: ' + positionX + 'px; top: ' + positionY + 'px;';
      button.innerHTML = '<img src=' + pins[i].author.avatar + ' width="40" height="40" draggable="false">';
      buttons.appendChild(button);
    }

    mapPins.appendChild(buttons);

    var mapPinsArray = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (i = 0; i < mapPinsArray.length; i++) {
      mapPinsArray[i].addEventListener('click', onPinClickhandler);
    }
  };

  /**
   * Функция отрисовки Popup окна
   * @param {object} evt
   */
  var onPinClickhandler = function (evt) {
    var target = evt.currentTarget;
    var offerId = target.getAttribute('data-id');
    if (window.sortedArr[offerId]) {
      window.createPopUp(window.sortedArr[offerId]);
    } else {
      window.createPopUp(window.housesArr[offerId]);
    }
  };

  /**
   * Удаляет все пины с карты
   */
  var removeAllPins = function () {
    var mapPin = document.querySelector('.map__pins');
    var mapPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < mapPins.length; i++) {
      var elem = mapPins[i];
      mapPin.removeChild(elem);
    }
  };

  window.pin = {
    createButtons: createButtons,
    removeAllPins: removeAllPins
  };
})();
