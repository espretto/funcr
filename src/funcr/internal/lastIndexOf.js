
module.exports = function (array, item) {
  for (var i = array.length; i--;) {
    if (array[i] === item) {
      return i
    }
  }
  return -1
}
