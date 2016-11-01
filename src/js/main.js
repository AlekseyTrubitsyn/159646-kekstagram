'use strict';

define(['./load', './picture', './resizer', './upload'], function(load, picture) {
  var filtersBlock = document.querySelector('.filters');

  hide(filtersBlock);

  var picturesCallbackName = '__jsonpCallback';
  var picturesUrl = 'http://localhost:1507/api/pictures?callback=';

  load(picturesUrl, function(data) {
    renderPictures(data);
    show(filtersBlock);
  }, picturesCallbackName);

  function renderPictures(pictures) {
    var picturesBlock = document.querySelector('.pictures');
    pictures.forEach(function(pictureData) {
      var element = picture(pictureData);
      picturesBlock.appendChild(element);
    });
  }

  function hide(element) {
    element.classList.remove('hidden');
  }

  function show(element) {
    element.classList.remove('hidden');
  }
});
