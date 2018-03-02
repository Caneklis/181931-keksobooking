'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var map = document.querySelector('.map');

  /**
   * Функция создания PopUp окна с предложением на карте
   * @param {object} houses
   */
  window.createPopUp = function (houses) {

    var mapFilters = document.querySelector('.map__filters-container');
    var popUpTemplate = document.querySelector('template').content;
    var popUpTemlateElement = popUpTemplate.querySelector('article');
    var popUpElement = popUpTemlateElement.cloneNode(true);
    popUpElement.querySelector('.popup__close').addEventListener('click', closePopUp);
    popUpElement.querySelector('h3').textContent = houses.offer.title;
    popUpElement.querySelector('p small').textContent = houses.offer.address;
    popUpElement.querySelector('.popup__price').innerHTML = houses.offer.price + ' &#x20bd;' + ' /ночь';
    popUpElement.querySelector('h4').textContent = window.utils.roomType(houses.offer.type);
    popUpElement.querySelectorAll('h4 + p').textContent = houses.offer.rooms + ' комнаты для ' + houses.offer.guests + ' гостей';
    popUpElement.querySelectorAll('p + p').textContent = 'Заезд после ' + houses.offer.checkin + ', выезд до ' + houses.offer.checkout;
    popUpElement.querySelectorAll('p')[4].textContent = houses.description;
    popUpElement.querySelector('.popup__avatar').src = houses.author.avatar;
    var features = popUpElement.querySelector('.popup__features');
    features.innerHTML = '';

    for (var i = 0; i < houses.offer.features.length; i++) {
      var featureLi = document.createElement('li');
      featureLi.className = 'feature feature--' + houses.offer.features[i];
      features.appendChild(featureLi);
    }
    var pictures = popUpElement.querySelector('.popup__pictures');
    for (i = 0; i < houses.offer.photos.length; i++) {
      var photoLi = document.createElement('li');
      photoLi.innerHTML = '<img src="' + houses.offer.photos[i] + '" width="65" height="65">';
      pictures.appendChild(photoLi);
    }

    closePopUp();
    map.addEventListener('keydown', onPopupEscPress);
    map.insertBefore(popUpElement, mapFilters);
  };

  /**
   * Функция закрытия popup окна при клике
   */
  var closePopUp = function () {
    var card = document.querySelector('.map__card');
    if (card) {
      map.removeChild(card);
      document.removeEventListener('keydown', onPopupEscPress);
      map.removeEventListener('keydown', onPopupEscPress);
    }
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopUp();
    }
  };

  window.popup = {
    close: closePopUp
  };
})();
