'use strict';

(function () {
  var MAIN_BUTTON_START_TOP = 375;
  var MAIN_BUTTON_START_LEFT = 50;
  var MIN_PRICES = {
    flat: 1000,
    bungalo: 0,
    house: 5000,
    palace: 10000
  };
  var noticeFormType = document.querySelector('#type');
  var noticeFormPrice = document.querySelector('#price');
  var noticeFormTimeIn = document.querySelector('#timein');
  var noticeFormTimeOut = document.querySelector('#timeout');
  var noticeFormRoomNumber = document.querySelector('#room_number');
  var noticeFormRoomCapacity = document.querySelector('#capacity');
  var mainPin = document.querySelector('.map__pin--main');
  var noticeForm = document.querySelector('.notice__form');

  /**
   * Функция добавления атрибута disabled у формы
   */
  var addFormDisabled = function () {
    var formFieldets = document.querySelectorAll('.form__element');
    for (var i = 0; i < formFieldets.length; i++) {
      formFieldets[i].disabled = true;
    }
  };
  addFormDisabled();

  /**
   * Функция удаления атрибута disabled у формы
   */
  var removeFormDisabled = function () {
    var formFieldets = document.querySelectorAll('.form__element');
    for (var i = 0; i < formFieldets.length; i++) {
      formFieldets[i].disabled = false;
    }
    validateNoticeForm();
  };

  /**
   * Функция валидации формы отправки
   */
  var validateNoticeForm = function () {
    window.noticeForm.setAttribute('action', 'https://js.dump.academy/keksobooking');

    noticeFormType.addEventListener('change', function (evt) {
      var target = evt.target;
      noticeFormPrice.min = MIN_PRICES[target.value];
    });

    noticeFormTimeIn.addEventListener('change', function () {
      noticeFormTimeOut.value = noticeFormTimeIn.value;
    });

    noticeFormTimeOut.addEventListener('change', function () {
      noticeFormTimeIn.value = noticeFormTimeOut.value;
    });

    noticeFormPrice.addEventListener('invalid', function () {
      if (noticeFormPrice.validity.tooLong) {
        noticeFormPrice.setCustomValidity('Максимальное значение — 1 000 000');
      }
    });

    noticeFormRoomNumber.addEventListener('change', function (evt) {
      var target = evt.target;
      compareRoomsGuests(target.value);
    });
  };

  /**
   * Функция соотношения комнаты и гостей
   * @param {string} value значение поля
   */
  var compareRoomsGuests = function (value) {
    if (+value !== 100) {
      noticeFormRoomCapacity.value = value;
      for (var i = 0; i < noticeFormRoomCapacity.options.length; i++) {
        if (+value >= +noticeFormRoomCapacity.options[i].value && +noticeFormRoomCapacity.options[i].value !== 0) {
          noticeFormRoomCapacity.options[i].disabled = false;
        } else {
          noticeFormRoomCapacity.options[i].disabled = true;
        }
      }
    } else {
      noticeFormRoomCapacity.value = '0';
      for (i = 0; i < noticeFormRoomCapacity.options.length; i++) {
        if (+noticeFormRoomCapacity.options[i].value > 0) {
          noticeFormRoomCapacity.options[i].disabled = true;
        }
      }
    }
  };

  /**
   * Функция очистки формы и карты
   */
  var returnInitialPageState = function () {
    window.noticeForm.reset();
    validateNoticeForm();
    addFormDisabled();
    window.popup.close();
    mainPin.style.top = MAIN_BUTTON_START_TOP + 'px';
    mainPin.style.left = MAIN_BUTTON_START_LEFT + '%';
    window.map.setAddress();

    var mapPins = document.querySelector('.map__pins');
    var mapPin = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    var map = document.querySelector('.map');
    map.classList.add('map--faded');

    for (var k = 0; k < mapPin.length; k++) {
      var elem = mapPin[k];
      mapPins.removeChild(elem);
    }
  };

  var resetNoticeFormButton = document.querySelector('.form__reset');
  resetNoticeFormButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    returnInitialPageState();
  });

  noticeForm.addEventListener('submit', function (evt) {
    validateNoticeForm();
    evt.preventDefault();
    window.backend.upload(new FormData(noticeForm), window.utils.showError);
    returnInitialPageState();
  });

  window.form = {
    removeFormDisabled: removeFormDisabled
  };
})();
