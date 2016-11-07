'use strict';

define(['./load', './picture', './gallery', './resizer', './upload'], function(load, Picture, Gallery) {

  var filtersBlock = document.querySelector('.filters');

  hide(filtersBlock);

  var picturesCallbackName = '__jsonpCallback';
  var picturesUrl = '/api/pictures?callback=';
  var gallery = new Gallery();

  load(picturesUrl, loadCallback, picturesCallbackName);

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
