//>>excludeStart('amdefine', true);
if (typeof define !== 'function') { var define = require('amdefine')(module) }
//>>excludeEnd('amdefine'); ----------------------------------------------------

define(['./internal/isContext'], function (isContext) {
  return function (func, gunc) {
    return function (arg) {
      return isContext(this)
        ? func.call(this, gunc.call(this, arg))
        : func(gunc(arg))
    }
  }
})
