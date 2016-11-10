'use strict';

define(['./load', './picture', './gallery', './resizer', './upload'], function(load, Picture, Gallery) {

  var filtersBlock = document.querySelector('.filters');

  hide(filtersBlock);

  var picturesUrl = '/api/pictures';
  var gallery = new Gallery();

  var pageNumber = 0;
  var pageSize = 12;
  var currentFilter = 'filter-popular';

  load(picturesUrl, {
    from: pageNumber * pageSize,
    to: pageNumber * pageSize + pageSize,
    filter: currentFilter
  }, loadCallback);

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
      pageNumber++;

      load(picturesUrl, {
        from: pageNumber * pageSize,
        to: pageNumber * pageSize + pageSize,
        filter: currentFilter
      }, loadCallback);
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
    if (!data.length) {
      return;
    }

    loadedData = loadedData.concat(data);

    gallery.setPictures(loadedData);
    renderPictures(data);
    show(filtersBlock);

    if (data.length === pageSize) {
      showNextPage();
    }
  }

  var picturesBlock = document.querySelector('.pictures');
  var renderedPictures = [];
  var renderedNumber = 0;

  function renderPictures(pictures) {
    pictures.forEach(function(pictureData) {
      var picture = new Picture(pictureData, gallery, renderedNumber);
      picturesBlock.appendChild(picture.element);
      renderedPictures = renderedPictures.concat(picture);
      renderedNumber++;
    });
  }

  filtersBlock.addEventListener('change', function(event) {
    if(event.target.classList.contains('filters-radio')) {
      setFilter(event.target.id);
    }
  });

  function removePictureListeners() {
    renderedPictures.forEach(function(pictureObject) {
      pictureObject.remove();
    });
  }

  function setFilter(filterId) {
    removePictureListeners();
    renderedPictures = [];
    renderedNumber = 0;
    loadedData = [];
    picturesBlock.innerHTML = '';

    pageNumber = 0;
    currentFilter = filterId;

    load(picturesUrl, {
      from: pageNumber * pageSize,
      to: pageNumber * pageSize + pageSize,
      filter: currentFilter
    }, loadCallback);
  }

  function hide(element) {
    element.classList.remove('hidden');
  }

  function show(element) {
    element.classList.remove('hidden');
  }
});
