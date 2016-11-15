'use strict';

define(function() {
  var waitForTimeout = false;

  function throttle(callback, timeout) {
    if(!waitForTimeout) {
      waitForTimeout = true;

      callback();

      setTimeout(function() {
        waitForTimeout = false;
      }, timeout);
    }
  }

  return throttle;
});
