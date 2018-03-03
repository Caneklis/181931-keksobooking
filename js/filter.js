'use strict';

(function () {
  var map = document.querySelector('.map');

  /**
   * функция применить фильтр
   */
  var applyFilters = function () {
    window.pin.removeAllPins();

    var filters = formFilters.querySelectorAll('input:checked, option:checked');
    var similarHouses = window.housesArr.filter(function (house) {
      var flag = true;
      for (var i = 0; i < filters.length; i++) {
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

    window.sortedArr = similarHouses;
  };

  var formFilters = document.querySelector('.map__filters');

  formFilters.addEventListener('change', function () {
    window.utils.debounce(applyFilters);
  });

})();
