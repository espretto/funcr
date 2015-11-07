
var reduce = require('./internal/reduce')
var reduceRight = require('./internal/reduceRight')
var thisify = require('./thisify')

module.exports = function (func, right) {
  return function (args, accum) {
    return (right ? reduceRight : reduce)(args, thisify(func, this, 4), accum)
  }
}
