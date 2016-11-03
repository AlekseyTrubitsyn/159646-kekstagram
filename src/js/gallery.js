'use strict';

define(function() {
  function Gallery() {
    this.pictures = [];
    this.activePicture = 0;
    this.overlay = document.querySelector('.gallery-overlay');
    this.overlayClose = this.overlay.querySelector('.gallery-overlay-close');
    this.overlayImage = this.overlay.querySelector('.gallery-overlay-image');
    this.likes = this.overlay.querySelector('.likes-count');
    this.comments = this.overlay.querySelector('.comments-count');
  }

  Gallery.prototype.setPictures = function(picturesArray) {
    this.pictures = picturesArray;
  };

  Gallery.prototype.show = function(number) {
    this.hide = this.hide.bind(this);
    this.nextPicture = this.nextPicture.bind(this);
    this.setActivePicture = this.setActivePicture.bind(this);

    this.overlayClose.addEventListener('click', this.hide);
    this.overlayImage.addEventListener('click', this.nextPicture);

    this.overlay.classList.remove('invisible');
    this.setActivePicture(number);
  };

  Gallery.prototype.hide = function() {
    this.overlay.classList.add('invisible');
    this.overlayClose.removeEventListener('click', this.hide);
    this.overlayImage.removeEventListener('click', this.setActivePicture);
  };

  Gallery.prototype.nextPicture = function() {
    this.setActivePicture = this.setActivePicture.bind(this);
    this.setActivePicture(this.activePicture + 1);
  };

  Gallery.prototype.setActivePicture = function(number) {
    this.activePicture = (number < this.pictures.length - 1) ? number : 0;

    var picture = this.pictures[number];
    this.overlayImage.src = picture.url;
    this.likes.innerText = picture.likes;
    this.comments.innerText = picture.comments;
  };

  return Gallery;
});
