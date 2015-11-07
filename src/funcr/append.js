
module.exports = function (array, brray) {
  var offset = array.length
  var len = brray.length
  var i = -1

  while (++i < len) array[i+offset] = brray[i]

  return array
}
