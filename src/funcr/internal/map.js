
module.exports = function (array, func) {
  var len = array.length
  var mapped = Array(len)
  var i = -1

  while (++i < len) mapped[i] = func(array[i], i, array);

  return mapped
}
