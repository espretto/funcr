
var isContext = require('./internal/isContext')

module.exports = function (func, gunc) {
  return function (arg) {
    return isContext(this)
      ? func.call(this, gunc.call(this, arg))
      : func(gunc(arg))
  }
}
