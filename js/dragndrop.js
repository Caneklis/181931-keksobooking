'use strict';

(function () {

  var dragSrcEl = null;

  var handleDragStart = function (e, elem) {
    dragSrcEl = elem;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', elem.innerHTML);
  };

  var cols = document.querySelectorAll('.form__photo-container .upload img');
  [].forEach.call(cols, function (col) {
    col.addEventListener('dragstart', handleDragStart, false);
  });

  var handleDragOver = function (e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';

    return false;
  };

  var handleDragEnter = function (elem) {
    elem.style.border = '2px dashed red';
  };

  var handleDragLeave = function (elem) {
    elem.style.border = 'none';
  };

  var handleDrop = function (e, elem) {

    if (e.stopPropagation) {
      e.stopPropagation();
    }

    if (dragSrcEl !== elem) {
      dragSrcEl.innerHTML = elem.innerHTML;
      elem.innerHTML = e.dataTransfer.getData('text/html');
    }

    return false;
  };

  var handleDragEnd = function () {

    [].forEach.call(cols, function (col) {
      col.style.border = 'none';
    });
  };

  [].forEach.call(cols, function (col) {
    col.addEventListener('dragstart', handleDragStart, false);
    col.addEventListener('dragenter', handleDragEnter, false);
    col.addEventListener('dragover', handleDragOver, false);
    col.addEventListener('dragleave', handleDragLeave, false);
    col.addEventListener('drop', handleDrop, false);
    col.addEventListener('dragend', handleDragEnd, false);
  });
})();
