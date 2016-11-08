'use strict';

define(function() {
  function getSearchString(params) {
    return Object.keys(params).map(function(param) {
      return [param, params[param]].join('=');
    }).join('&');
  }

  function load(url, params, callback) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', function(event) {
      if (event.target.readyState === 4) {
        try {
          var data = JSON.parse(event.target.response);
          callback(data);
        } catch(error) {
          console.log(error);
        }
      }
    });

    xhr.open('GET', url + '?' + getSearchString(params));
    console.log(getSearchString(params));
    xhr.send();
  }

  return load;
});
