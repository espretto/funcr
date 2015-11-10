//>>excludeStart('amdefine', true);
if (typeof define !== 'function') { var define = require('amdefine')(module) }
//>>excludeEnd('amdefine');

define(['./rest'], function (rest) {
  
  var hasOwnProperty = Object.prototype.hasOwnProperty

  return function (func, hash) {
    var memoized = rest(function (args) {
      var key = hash ? hash(args) : args.join('|')
      var cache = memoized.cache

      return hasOwnProperty.call(cache, key)
        ? cache[key]
        : (cache[key] = func.apply(this, args))
    })

    memoized.cache = {}

    return memoized
  }
})
