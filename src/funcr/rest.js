//>>excludeStart('amdefine', true);
if (typeof define !== 'function') { var define = require('amdefine')(module) }
//>>excludeEnd('amdefine'); ----------------------------------------------------

define(function () {
  return function (func, offset) {
    if (offset !== +offset) offset = func.length-1
    if (offset < 0) offset = 0

    return function () {
      var len = arguments.length
      var i = -1
      var args = []
      var brgs = []

      while (++i < offset) args[i] = arguments[i]

      args[i--] = brgs

      while (++i < len) brgs[i-offset] = arguments[i]

      return func.apply(this, args)
    }
  }
})