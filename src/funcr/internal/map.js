//>>excludeStart('amdefine', true);
if (typeof define !== 'function') { var define = require('amdefine')(module) }
//>>excludeEnd('amdefine'); ----------------------------------------------------

define(function () {
  return function (array, func) {
    var len = array.length
    var mapped = Array(len)
    var i = -1

    while (++i < len) mapped[i] = func(array[i], i, array);

    return mapped
  }
})
