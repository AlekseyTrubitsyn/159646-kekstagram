/* exported getMessage(a, b) */
/*'use strict';

function getMessage(a, b) {
  if (typeof a === 'boolean') {
    if (a) {
      return 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
    } else {
      return 'Переданное GIF-изображение не анимировано';
    }
  }

  if (typeof a === 'number') {
    return 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + b * 4 + ' атрибутов';
  }

  if (Array.isArray(a) && !Array.isArray(b)) {
    var amountOfRedPoints = a.reduce(function(sum, current) {
      return sum + current;
    });
    return 'Количество красных точек во всех строчках изображения: ' + amountOfRedPoints;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    var artifactsSquare = a.reduce(function(sum, currentItem, index) {
      return (currentItem * b[index]) + sum;
    }, 0);

    return 'Общая площадь артеф актов сжатия: ' + artifactsSquare + ' пикселей';
  }

  return 'Переданы некорректные данные';
}*/
