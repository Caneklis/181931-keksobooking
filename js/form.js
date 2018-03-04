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
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
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
    window.noticeForm.classList.add('notice__form--disabled');
    var formFieldets = document.querySelectorAll('fieldset');
    for (var i = 0; i < formFieldets.length; i++) {
      formFieldets[i].disabled = true;
    }
  };
  addFormDisabled();

  /**
   * Функция удаления атрибута disabled у формы
   */
  var removeFormDisabled = function () {
    var formFieldets = document.querySelectorAll('fieldset');
    for (var i = 0; i < formFieldets.length; i++) {
      formFieldets[i].disabled = false;
    }
    validateNoticeForm();
  };

  /**
   * Функция установки атрибута минимального значения цены
   */
  var setMinPrice = function () {
    var minPrice = document.querySelector('#price');
    var typeHouse = document.querySelector('#type option:checked');
    minPrice.setAttribute('min', MIN_PRICES[typeHouse.value]);
  };

  /**
   * Функция валидации формы отправки
   */
  var validateNoticeForm = function () {
    window.noticeForm.setAttribute('action', 'https://js.dump.academy/keksobooking');
    setMinPrice();

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
    removeFormPhotos();

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

  /**
   * Функция загрузки аватара
   */
  var uploadPhotoAvatar = function () {
    var fileChooser = document.querySelector('.upload #avatar');
    var preview = document.querySelector('.notice__preview img');

    fileChooser.addEventListener('change', function () {
      var file = fileChooser.files[0];
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          preview.src = reader.result;
        });

        reader.readAsDataURL(file);
      }
    });
  };
  uploadPhotoAvatar();

  /**
   * Функция загрузки своей фотографии
   */
  var uploadPhotoHouse = function () {
    var fileChooser = document.querySelector('#images');
    var photoContainer = document.querySelector('.form__photo-container');

    var insertPhoto = function (file) {
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();
        reader.onload = function (e) {
          var img = document.createElement('IMG');
          img.src = e.target.result;
          img.width = 140;
          img.setAttribute('draggable', 'true');
          photoContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
      }
    };

    fileChooser.addEventListener('change', function () {
      for (var i = 0; i < fileChooser.files.length; i++) {
        insertPhoto(fileChooser.files[i]);
      }
    });
  };
  uploadPhotoHouse();

  /**
   * Функция удаления изображений из формы
   */
  var removeFormPhotos = function () {
    document.querySelector('.notice__preview img').src = 'img/muffin.png';
    var formPhotos = document.querySelectorAll('.form__photo-container img');

    for (var i = 0; i < formPhotos.length; i++) {
      formPhotos[i].remove();
    }
  };

  window.form = {
    removeFormDisabled: removeFormDisabled
  };
})();
