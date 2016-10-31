/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

define(function() {
  (function() {
    /** @enum {string} */
    var FileType = {
      'GIF': '',
      'JPEG': '',
      'PNG': '',
      'SVG+XML': ''
    };

    /** @enum {number} */
    var Action = {
      ERROR: 0,
      UPLOADING: 1,
      CUSTOM: 2
    };

    /**
     * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
     * из ключей FileType.
     * @type {RegExp}
     */
    var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

    /**
     * @type {Object.<string, string>}
     */
    var filterMap;

    /**
     * Объект, который занимается кадрированием изображения.
     * @type {Resizer}
     */
    var currentResizer;

    /**
     * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
     * изображением.
     */
    var cleanupResizer = function() {
      if (currentResizer) {
        currentResizer.remove();
        currentResizer = null;
      }
    };

    /**
     * Ставит одну из трех случайных картинок на фон формы загрузки.
     */
    var updateBackground = function() {
      var images = [
        'img/logo-background-1.jpg',
        'img/logo-background-2.jpg',
        'img/logo-background-3.jpg'
      ];

      var backgroundElement = document.querySelector('.upload');
      var randomImageNumber = Math.round(Math.random() * (images.length - 1));
      backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
    };

    /**
     * Форма загрузки изображения.
     * @type {HTMLFormElement}
     */
    var uploadForm = document.forms['upload-select-image'];

    /**
     * Форма кадрирования изображения.
     * @type {HTMLFormElement}
     */
    var resizeForm = document.forms['upload-resize'];

    /**
     * Форма добавления фильтра.
     * @type {HTMLFormElement}
     */
    var filterForm = document.forms['upload-filter'];

    /**
     * @type {HTMLImageElement}
     */
    var filterImage = filterForm.querySelector('.filter-image-preview');

    /**
     * @type {HTMLElement}
     */
    var uploadMessage = document.querySelector('.upload-message');

    /**
     * @param {Action} action
     * @param {string=} message
     * @return {Element}
     */
    var showMessage = function(action, message) {
      var isError = false;

      switch (action) {
        case Action.UPLOADING:
          message = message || 'Кексограмим&hellip;';
          break;

        case Action.ERROR:
          isError = true;
          message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
          break;
      }

      uploadMessage.querySelector('.upload-message-container').innerHTML = message;
      uploadMessage.classList.remove('invisible');
      uploadMessage.classList.toggle('upload-message-error', isError);
      return uploadMessage;
    };

    var hideMessage = function() {
      uploadMessage.classList.add('invisible');
    };

    /**
     * Поле ввода координаты угла кадра
     * по горизонтали ("Слева").
     *
     * @type {HTMLFormElement}
     */
    var widthController = document.querySelector('#resize-x');

    /**
     * Поле ввода координаты угла кадра
     * по вертикали ("Сверху").
     *
     * @type {HTMLFormElement}
     */
    var heightController = document.querySelector('#resize-y');

    /**
     * Поле ввода размера стороны квадрата,
     * который будет вырезан из изображения.
     *
     * @type {HTMLFormElement}
     */
    var sizeController = document.querySelector('#resize-size');

    /**
     * Кнопка вперед.
     *
     * @type {HTMLFormElement}
     */
    var forwardButton = document.querySelector('#resize-fwd');

    var xValueIsOk = false;
    var yValueIsOk = false;
    var sizeValueIsOk = false;

    /**
     * Проверяет, валидны ли данные, в форме кадрирования.
     *
     * @return {boolean}
     */
    function resizeFormIsValid() {
      return xValueIsOk && yValueIsOk && sizeValueIsOk;
    }

    function checkValuesSetAvailability() {
      if (currentResizer) {
        checkValueX();
        checkValueY();
        checkValueSize();
        forwardButton.disabled = !resizeFormIsValid();
      }
    }

    function checkValueX() {
      var x = parseInt(widthController.value, 10);
      var size = parseInt(sizeController.value, 10);

      var widthIsWrong = (x + size) > currentResizer._image.naturalWidth;
      xValueIsOk = !(isNaN(x) || (x < 0) || widthIsWrong);
    }

    function checkValueY() {
      var y = parseInt(heightController.value, 10);
      var size = parseInt(sizeController.value, 10);

      var heightIsWrong = (y + size) > currentResizer._image.naturalHeight;
      yValueIsOk = !(isNaN(y) || (y < 0) || heightIsWrong);
    }

    function checkValueSize() {
      var x = parseInt(widthController.value, 10);
      var y = parseInt(heightController.value, 10);
      var size = parseInt(sizeController.value, 10);

      var widthIsWrong = (x + size) > currentResizer._image.naturalWidth;
      var heightIsWrong = (y + size) > currentResizer._image.naturalHeight;
      var overflowed = widthIsWrong || heightIsWrong;

      sizeValueIsOk = !(isNaN(size) || (size < 0) || overflowed);
    }

    // Проверим данные на валидность сразу при вводе.
    widthController.addEventListener('input', function() {
      checkValueX();
      forwardButton.disabled = !resizeFormIsValid();
    });

    heightController.addEventListener('input', function() {
      checkValueY();
      forwardButton.disabled = !resizeFormIsValid();
    });

    sizeController.addEventListener('input', function() {
      checkValueSize();
      forwardButton.disabled = !resizeFormIsValid();
    });

    /**
     * Обработчик изменения изображения в форме загрузки. Если загруженный
     * файл является изображением, считывается исходник картинки, создается
     * Resizer с загруженной картинкой, добавляется в форму кадрирования
     * и показывается форма кадрирования.
     * @param {Event} evt
     */
    uploadForm.addEventListener('change', function(evt) {
      var element = evt.target;
      if (element.id === 'upload-file') {
        // Проверка типа загружаемого файла, тип должен быть изображением
        // одного из форматов: JPEG, PNG, GIF или SVG.
        if (fileRegExp.test(element.files[0].type)) {
          var fileReader = new FileReader();

          showMessage(Action.UPLOADING);

          fileReader.addEventListener('load', function() {
            cleanupResizer();

            currentResizer = new Resizer(fileReader.result);
            currentResizer.setElement(resizeForm);
            uploadMessage.classList.add('invisible');

            uploadForm.classList.add('invisible');
            resizeForm.classList.remove('invisible');

            hideMessage();

            checkValuesSetAvailability();
          });

          fileReader.readAsDataURL(element.files[0]);

          // Пропишем минимальные значения без доп проверок
          widthController.min = 0;
          heightController.min = 0;
          sizeController.min = 0;

        } else {
          // Показ сообщения об ошибке, если формат загружаемого файла не поддерживается
          showMessage(Action.ERROR);
        }
      }
    });

    /**
     * Обработка сброса формы кадрирования. Возвращает в начальное состояние
     * и обновляет фон.
     * @param {Event} evt
     */
    resizeForm.addEventListener('reset', function(evt) {
      evt.preventDefault();

      cleanupResizer();
      updateBackground();

      resizeForm.classList.add('invisible');
      uploadForm.classList.remove('invisible');
    });

    /**
     * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
     * кропнутое изображение в форму добавления фильтра и показывает ее.
     * @param {Event} evt
     */
    resizeForm.addEventListener('submit', function(evt) {
      evt.preventDefault();

      if (resizeFormIsValid()) {
        var image = currentResizer.exportImage().src;

        var thumbnails = filterForm.querySelectorAll('.upload-filter-preview');
        for (var i = 0; i < thumbnails.length; i++) {
          thumbnails[i].style.backgroundImage = 'url(' + image + ')';
        }

        filterImage.src = image;

        resizeForm.classList.add('invisible');
        filterForm.classList.remove('invisible');

        readFilterCookies();
      }
    });

    /**
     * Сброс формы фильтра. Показывает форму кадрирования.
     * @param {Event} evt
     */
    filterForm.addEventListener('reset', function(evt) {
      evt.preventDefault();

      filterForm.classList.add('invisible');
      resizeForm.classList.remove('invisible');
    });

    /**
     * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
     * записав сохраненный фильтр в cookie.
     * @param {Event} evt
     */
    filterForm.addEventListener('submit', function(evt) {
      evt.preventDefault();

      cleanupResizer();
      updateBackground();
      writeFilterCookies();

      filterForm.classList.add('invisible');
      uploadForm.classList.remove('invisible');
    });

    /**
     * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
     * выбранному значению в форме.
     */
    filterForm.addEventListener('change', changeFilter);

    function changeFilter() {
      if (!filterMap) {
        // Ленивая инициализация. Объект не создается до тех пор, пока
        // не понадобится прочитать его в первый раз, а после этого запоминается
        // навсегда.
        filterMap = {
          'none': 'filter-none',
          'chrome': 'filter-chrome',
          'sepia': 'filter-sepia',
          'marvin': 'filter-marvin'
        };
      }

      var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
        return item.checked;
      })[0].value;

      // Класс перезаписывается, а не обновляется через classList потому что нужно
      // убрать предыдущий примененный класс. Для этого нужно или запоминать его
      // состояние или просто перезаписывать.
      filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
    }

    var cookies = window.Cookies;

    function writeFilterCookies() {
      var cookieFilterKey = 'upload-filter';
      var form = document.forms['upload-filters'];
      var filters = form.elements['upload-filter'];
      var filterValue = filters.value;

      cookies.set(cookieFilterKey, filterValue, { expires: getCookiesExpiration() });
    }

    function readFilterCookies() {
      var cookieFilterKey = 'upload-filter';
      var filterControls = '.upload-filter-controls';
      var filterValue = cookies.get(cookieFilterKey);

      if (!filterValue) {
        return;
      }

      var selector = filterControls + ' input[value="' + filterValue + '"]';
      var filter = document.querySelector(selector);

      filter.checked = true;
      changeFilter();
    }

    // День рождения Грейс Хоппер - 9 декабря 1906 года. Кэп
    function getCookiesExpiration() {
      var oneDayMilliseconds = 24 * 60 * 60 * 1000;
      var currentDate = new Date();
      var currentYear = currentDate.getFullYear();
      var birthday = new Date(1906, 12, 9);

      birthday.setFullYear(currentYear);

      if (currentDate <= birthday) {
        birthday.setFullYear(currentYear - 1);
      }

      return Math.round((currentDate.getTime() - birthday.getTime()) / oneDayMilliseconds);
    }

    cleanupResizer();
    updateBackground();
  })();
});
