
var defaultContext = Function('return this')()

module.exports = function (any) {
  return any != null && any !== defaultContext
}
