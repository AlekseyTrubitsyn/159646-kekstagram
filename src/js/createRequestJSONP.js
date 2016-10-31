define(function() {
  return function(url, callback, callbackName) {
    window[callbackName] = function(data) {
      callback(data);
    }

    var script = document.createElement('script');
    script.src = url + callbackName;
    document.body.appendChild(script);
  };
};
