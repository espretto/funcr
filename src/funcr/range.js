
var undefined

module.exports = function (begin, step, end) {
  var result = []
  var i = -1

  if (step === undefined) {
    end = begin || 0 // i.e. return empty array
    begin = 0
    step = 1
  } else if (end === undefined) {
    end = step
    step = 1
  }

  if (begin < end) result[0] = 0 // preset as numerically typed
  
  for (; begin < end; begin += step) result[++i] = begin

  return result
}
