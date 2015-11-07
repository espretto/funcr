
var rest = require('./rest')

var hasOwnProperty = Object.prototype.hasOwnProperty

module.exports = function (func, hash) {
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
