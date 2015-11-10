//>>excludeStart('amdefine', true);
if (typeof define !== 'function') { var define = require('amdefine')(module) }
//>>excludeEnd('amdefine'); ----------------------------------------------------

define(function () {
  return function (array, item) {
    for (var i = array.length; i--;) {
      if (array[i] === item) {
        return i
      }
    }
    return -1
  }
})
