'use strict';
(function () {
  var PRICE_CHECK = {
    low: {
      min: 0,
      max: 9999
    },
    middle: {
      min: 10000,
      max: 50000
    },
    high: {
      min: 50000,
      max: 1000000
    },
  };

  window.noticeForm = document.querySelector('.notice__form');
  window.housesArr = [];
  window.data = {
    priceCheck: PRICE_CHECK
  };
})();
