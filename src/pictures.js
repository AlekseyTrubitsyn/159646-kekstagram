'use strict';

(function() {
  var filtersBlock = document.querySelector('.filters');
  var picturesBlock = document.querySelector('.pictures');

  var pictureTemplate = document.querySelector('#picture-template');
  var templateContainer = 'content' in pictureTemplate ? pictureTemplate.content : pictureTemplate;

  var pictureElementTemplate = templateContainer.querySelector('.picture');
  var IMAGE_WIDTH = 182;
  var IMAGE_HEIGHT = 182;

  var CALLBACK_NAME = '__jsonpCallback';
  var JSONP_URL = 'http://localhost:1507/api/pictures?callback=' + CALLBACK_NAME;

  var pictures = [];

  hide(filtersBlock);

  load(JSONP_URL, function(data){
    pictures = data;
    renderPictures();
  });

  show(filtersBlock);

  function hide(element) {
    element.classList.add('hidden');
  }

  function show(element) {
    element.classList.remove('hidden');
  }

  function pictureElement(pictureData) {
    var element = pictureElementTemplate.cloneNode(true);
    var elementImage = element.querySelector('img');
    var contentImage = new Image();

    contentImage.onload = function(event){
      elementImage.src = event.target.src;
      elementImage.width = IMAGE_WIDTH;
      elementImage.height = IMAGE_HEIGHT;
    }

    contentImage.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    contentImage.src = pictureData.url;

    return element;
  };

  function renderPictures() {
    pictures.forEach(function(picture) {
      var element = pictureElement(picture);
      picturesBlock.appendChild(element);
    });
  };

  function load(url, callback) {
    window[CALLBACK_NAME] = function(data) {
      callback(data);
    }

    var script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
  };

})();
