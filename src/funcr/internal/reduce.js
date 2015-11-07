
var undefined

var ERR_TEXT = 'reduce of empty array with no initial value'

module.exports = function (array, func, accum) {
  var len = array.length
  var i = -1
      
  if (accum === undefined) {
    if (!len) throw new Error(ERR_TEXT)
    accum = array[++i]
  }

  while (++i < len) accum = func(accum, array[i], i, array)

  return accum
}
