//>>excludeStart('amdefine', true);
if (typeof define !== 'function') { var define = require('amdefine')(module) }
//>>excludeEnd('amdefine'); ----------------------------------------------------

define(function () {
  return  function (func, limit) {
    return function (args) {
      if (+limit === limit) args.push(args.splice(limit, args.length-limit))
      return func.apply(this, args)
    }
  }
})
