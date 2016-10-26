'use strict';

(function() {
  var filtersBlock = document.querySelector('.filters');
  var picturesBlock = document.querySelector('.pictures');

  var pictureTemplate = document.querySelector('#picture-template');
  var templateContainer = 'content' in pictureTemplate ? pictureTemplate.content : pictureTemplate;

  var pictureElementTemplate = templateContainer.querySelector('.picture');
  var IMAGE_WIDTH = 182;
  var IMAGE_HEIGHT = 182;

  hide(filtersBlock);

  var picturesCallbackName = '__jsonpCallback';
  var picturesUrl = 'http://localhost:1507/api/pictures?callback=';

  createRequestJSONP(picturesUrl, function(data){
    renderPictures(data);
    show(filtersBlock);
  }, picturesCallbackName);

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

  function renderPictures(pictures) {
    pictures.forEach(function(picture) {
      var element = pictureElement(picture);
      picturesBlock.appendChild(element);
    });
  };

  function createRequestJSONP(url, callback, callbackName) {
    window[callbackName] = function(data) {
      callback(data);
    }

    var script = document.createElement('script');
    script.src = url + callbackName;
    document.body.appendChild(script);
  };

})();
