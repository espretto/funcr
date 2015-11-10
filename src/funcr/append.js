//>>excludeStart('amdefine', true);
if (typeof define !== 'function') { var define = require('amdefine')(module) }
//>>excludeEnd('amdefine'); ----------------------------------------------------

define(function () {
  return function (array, brray) {
    var offset = array.length
    var len = brray.length
    var i = -1

    while (++i < len) array[i+offset] = brray[i]

    return array
  }
})
