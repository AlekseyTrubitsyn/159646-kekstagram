function getMessage(a, b) {
  if (typeof a == "boolean") {
    if (a) {
      return "Переданное GIF-изображение анимировано и содержит " + b + " кадров";      
    } else {
      return "Переданное GIF-изображение не анимировано";      
    }

  } else {
    if (!isNaN(a)) {
      return "Переданное SVG-изображение содержит " + a + " объектов и " + b * 4 + " атрибутов";

    } else {
      if (Array.isArray(a) && Array.isArray(b)) {

        var artifactsSquare = 0;
        a.forEach(function(item, i, arr) {
          artifactsSquare += item * b[i];
        });
        return "Общая площадь артефактов сжатия: " + artifactsSquare + " пикселей";

      } else {
        if (Array.isArray(a)) {
          var amountOfRedPoints = a.reduce(function (sum, current) {
            return sum + current;
          });
          return "Количество красных точек во всех строчках изображения: " + amountOfRedPoints;

        } else {
          return "Переданы некорректные данные";
        }
      }
    }
  }
}