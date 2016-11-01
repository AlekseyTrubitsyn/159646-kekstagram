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
    var pictureTemplate = document.querySelector('#picture-template');
    var templateContainer = 'content' in pictureTemplate ? pictureTemplate.content : pictureTemplate;
    var pictureElementTemplate = templateContainer.querySelector('.picture');

    pictures.forEach(function(pictureData) {
      var element = picture(pictureData, pictureElementTemplate);
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
