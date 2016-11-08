'use strict';

define(['./load', './picture', './gallery', './resizer', './upload'], function(load, Picture, Gallery) {

  var filtersBlock = document.querySelector('.filters');

  hide(filtersBlock);

  var picturesUrl = '/api/pictures';
  var gallery = new Gallery();

  var pageNumber = 0;
  var pageSize = 12;
  var currentFilter = '';
  var params = {
    from: pageNumber * pageSize,
    to: pageNumber * pageSize + pageSize,
    filter: currentFilter
  };

  load(picturesUrl, params, loadCallback);

  var footer = document.querySelector('.footer');
  var scrollingGap = 100;
  var throttleTimeout = 100;
  var lastCall = Date.now();

  window.addEventListener('scroll', function() {
    if (Date.now() - lastCall >= throttleTimeout) {
      var clientRect = footer.getBoundingClientRect();
      var bottomDelta = clientRect.bottom - window.innerHeight;

      if (bottomDelta <= scrollingGap) {
        params.from = ++pageNumber * pageSize;
        params.to = params.from + pageSize;

        load(picturesUrl, params, loadCallback);
      }
      lastCall = Date.now();
    }
  });

  function loadCallback(data) {
    renderPictures(data);
    show(filtersBlock);
    gallery.setPictures(data);
  }

  function renderPictures(pictures) {
    var picturesBlock = document.querySelector('.pictures');

    pictures.forEach(function(pictureData, index) {
      var picture = new Picture(pictureData, gallery, index);
      picturesBlock.appendChild(picture.element);
    });
  }

  function hide(element) {
    element.classList.remove('hidden');
  }

  function show(element) {
    element.classList.remove('hidden');
  }
});
