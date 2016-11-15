'use strict';

define(function() {
  function throttle(throttlingFunction, timeout) {
    var lastCall = Date.now();

    return function() {
      var isTimeoutEnded = Date.now() - lastCall >= timeout;

      if (isTimeoutEnded) {
        throttlingFunction();
        lastCall = Date.now();
      }
    };
  }

  return throttle;
});
