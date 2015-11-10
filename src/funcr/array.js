//>>excludeStart('amdefine', true);
if (typeof define !== 'function') { var define = require('amdefine')(module) }
//>>excludeEnd('amdefine'); ----------------------------------------------------

define(function () {
  return function (len) {
    return Array.apply(null, Array(len))
  }
})
