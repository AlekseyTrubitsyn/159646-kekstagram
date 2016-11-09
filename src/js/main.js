'use strict';

define(['./load', './picture', './gallery', './resizer', './upload'], function(load, Picture, Gallery) {

  var filtersBlock = document.querySelector('.filters');

  hide(filtersBlock);

  var picturesUrl = '/api/pictures';
  var gallery = new Gallery();

  var pageNumber = 0;
  var pageSize = 12;
  var currentFilter = 'filter-popular';
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

  function isFooterVisible() {
    var clientRect = footer.getBoundingClientRect();
    var bottomDelta = clientRect.bottom - window.innerHeight;
    return bottomDelta <= scrollingGap;
  }

  function showNextPage() {
    if (isFooterVisible()) {
      params.from = ++pageNumber * pageSize;
      params.to = params.from + pageSize;

      load(picturesUrl, params, loadCallback);
    }
    lastCall = Date.now();
  }

  window.addEventListener('scroll', function() {
    var isTimeoutEnded = Date.now() - lastCall >= throttleTimeout;
    if (isTimeoutEnded) {
      showNextPage();
    }
  });

  var loadedData = [];

  function loadCallback(data) {
    if (data.length === 0) {
      return;
    }

    loadedData = loadedData.concat(data);
    picturesBlock.innerHTML = '';

    renderPictures(loadedData);
    show(filtersBlock);
    gallery.setPictures(loadedData);

    if (data.length === pageSize) {
      showNextPage();
    }
  }

  var picturesBlock = document.querySelector('.pictures');

  function renderPictures(pictures) {
    pictures.forEach(function(pictureData, index) {
      var picture = new Picture(pictureData, gallery, index);
      picturesBlock.appendChild(picture.element);
    });
  }

  filtersBlock.addEventListener('change', function(event) {
    if(event.target.classList.contains('filters-radio')) {
      setFilter(event.target.id);
    }
  });

  function setFilter(filterId) {
    picturesBlock.innerHTML = '';
    loadedData = [];

    pageNumber = 0;
    currentFilter = filterId;
    params.from = pageNumber;
    params.to = pageNumber + pageSize;
    params.filter = currentFilter;

    load(picturesUrl, params, loadCallback);
  }

  function hide(element) {
    element.classList.remove('hidden');
  }

  function show(element) {
    element.classList.remove('hidden');
  }
});
