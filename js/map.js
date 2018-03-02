'use strict';

(function () {
  var MAIN_BUTTON_WIDTH = 65;
  var MAIN_BUTTON_HEIGHT = 87;
  var TOP_LIMIT = 150;
  var BOTTOM_LIMIT = 500;
  var DEBOUNCE_TIME = 500;
  var mainPin = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');

  /**
   * Функция перетаскивания метки и активации карты
   */
  var mainPinMouseUpHandler = function () {
    map.classList.remove('map--faded');
    window.noticeForm.classList.remove('notice__form--disabled');
    setAddress();
    window.backend.load(getData);
    window.form.removeFormDisabled();
  };

  var getData = function (data) {
    window.housesArr = data;
    window.pin.createButtons(data);
  };

  var mainPinMouseDownHandler = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mainPinMouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var mainPinY = mainPin.offsetTop + MAIN_BUTTON_HEIGHT;
      var mainPinX = mainPin.offsetLeft + MAIN_BUTTON_WIDTH / 2;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      if ((mainPinX - shift.x <= map.offsetWidth) && (mainPinX - shift.x >= mainPin.offsetWidth)) {
        mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
      }
      if ((mainPinY - shift.y <= BOTTOM_LIMIT) && (mainPinY - shift.y >= TOP_LIMIT)) {
        mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      setAddress();
      document.removeEventListener('mousemove', mainPinMouseMoveHandler);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', mainPinMouseMoveHandler);
    document.addEventListener('mouseup', onMouseUp);
  };

  mainPin.addEventListener('mouseup', mainPinMouseUpHandler);
  mainPin.addEventListener('mousedown', mainPinMouseDownHandler);

  /**
   * Функция получения координат главной метки
   * @return {number} координаты x, y
   */
  var getMainPinCoordinates = function () {
    var x = mainPin.offsetLeft - MAIN_BUTTON_WIDTH / 2;
    var y = mainPin.offsetTop + MAIN_BUTTON_HEIGHT;
    return x + ', ' + y;
  };

  /**
   * Функция добавления координат главной точки в поле адрес
   */
  var setAddress = function () {
    window.noticeForm.querySelector('#address').value = getMainPinCoordinates();
  };

  /**
  * функция применить фильтр
  */
  var applyFilters = function () {
    var mapPins = document.querySelector('.map__pins');
    var mapPin = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    map.classList.add('map--faded');

    for (var i = 0; i < mapPin.length; i++) {
      var elem = mapPin[i];
      mapPins.removeChild(elem);
    }

    var filters = formFilters.querySelectorAll('input:checked, option:checked');
    var similarHouses = window.housesArr.filter(function (house) {
      var flag = true;
      for (i = 0; i < filters.length; i++) {
        if (!(
          (filters[i].tagName === 'OPTION' && (
            filters[i].value === 'any' ||
            (filters[i].parentNode.name === 'housing-type' && house.offer.type === filters[i].value) ||
            (filters[i].parentNode.name === 'housing-price' && (house.offer.price >= window.data.priceCheck[filters[i].value].min) &&
             (house.offer.price <= window.data.priceCheck[filters[i].value].max)) ||
            (filters[i].parentNode.name === 'housing-rooms' && String(house.offer.rooms) === filters[i].value) ||
            (filters[i].parentNode.name === 'housing-guests' && String(house.offer.guests) === filters[i].value)
          )
          ) || (filters[i].tagName === 'INPUT' && house.offer.features.includes(filters[i].value))
        )) {
          flag = false;
        }
      }
      return flag;
    });
    if (similarHouses.length > 0) {
      map.classList.remove('map--faded');
      window.popup.close();
      window.pin.createButtons(similarHouses);
    }
  };

  var formFilters = document.querySelector('.map__filters');

  formFilters.addEventListener('change', function () {
    debounce(applyFilters);
  });

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

  window.map = {
    setAddress: setAddress
  };
})();
