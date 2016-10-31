'use strict';

define([
  './picture',
  './createRequestJSONP'
], function(picture, createRequestJSONP) {
  function createPictures() {
    var filtersBlock = document.querySelector('.filters');
    var picturesBlock = document.querySelector('.pictures');

    hide(filtersBlock);

    var picturesCallbackName = '__jsonpCallback';
    var picturesUrl = 'http://localhost:1507/api/pictures?callback=';

    createRequestJSONP(picturesUrl, function(data) {
      renderPictures(data);
      show(filtersBlock);
    }, picturesCallbackName);

    function renderPictures(pictures) {
      pictures.forEach(function(pictureData) {
        var element = picture(pictureData);
        picturesBlock.appendChild(element);
      });
    }
  }

  function hide(element) {
    element.classList.remove('hidden');
  }

  function show(element) {
    element.classList.remove('hidden');
  }

  return createPictures;
});
