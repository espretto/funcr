
var undefined

var ERR_TEXT = 'reduce of empty array with no initial value'

module.exports = function (array, func, accum) {
  var len = array.length
      
  if (accum === undefined) {
    if (!len) throw new Error(ERR_TEXT)
    accum = array[--len]
  }

  while (len--) accum = func(accum, array[len], len, array)

  return accum
}
