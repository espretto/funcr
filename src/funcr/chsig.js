//>>excludeStart('amdefine', true);
if (typeof define !== 'function') { var define = require('amdefine')(module) }
//>>excludeEnd('amdefine'); ----------------------------------------------------

define([
  './rest',
  './internal/map'
], function () {

  function prop (object) {
    return function (key) {
      return object[key]
    }
  }

  return rest(function (func, indices) {
    return rest(function (args) {
      return func.apply(this, map(indices, prop(args)))
    })
  })
})
