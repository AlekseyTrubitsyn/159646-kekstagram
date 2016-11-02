'use strict';

define(function() {
  var pictureTemplate = document.querySelector('#picture-template');
  var templateContainer = 'content' in pictureTemplate ? pictureTemplate.content : pictureTemplate;
  var pictureElementTemplate = templateContainer.querySelector('.picture');

  function createPictureElement(pictureData) {
    var element = pictureElementTemplate.cloneNode(true);
    var elementImage = element.querySelector('img');
    var contentImage = new Image();

    var IMAGE_WIDTH = 182;
    var IMAGE_HEIGHT = 182;

    contentImage.onload = function(event) {
      elementImage.src = event.target.src;
      elementImage.width = IMAGE_WIDTH;
      elementImage.height = IMAGE_HEIGHT;
    };

    contentImage.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    contentImage.src = pictureData.url;

    return element;
  }

  return createPictureElement;
});
