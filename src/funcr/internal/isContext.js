//>>excludeStart('amdefine', true);
if (typeof define !== 'function') { var define = require('amdefine')(module) }
//>>excludeEnd('amdefine'); ----------------------------------------------------

define(function () {
  
  var defaultContext = Function('return this')()
  
  return function (any) {
    return any != null && any !== defaultContext
  }
})

