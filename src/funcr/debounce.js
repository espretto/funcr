
var rest = require('./rest')
var tick = require('./internal/tick')

module.exports = function (func, minDelay) {
  var ctx
  var args
  var tack
  var timer
  
  function bounce () {
    var delay = tick() - tack

    if (delay < minDelay) {
      setTimeout(bounce, minDelay - delay)
    } else {
      timer = 0
      func.apply(ctx, args)
    }
  }

  return rest(function(these) {
    ctx = this
    args = these
    tack = tick()
    timer || (timer = setTimeout(bounce, minDelay))
  })
}
