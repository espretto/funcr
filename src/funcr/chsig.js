
var rest = require('./rest')
var map = require('./internal/map')

function prop (object) {
  return function (key) {
    return object[key]
  }
}

module.exports = rest(function (func, indices) {
  return rest(function (args) {
    return func.apply(this, map(indices, prop(args)))
  })
})
