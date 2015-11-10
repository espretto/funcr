//>>excludeStart('amdefine', true);
if (typeof define !== 'function') { var define = require('amdefine')(module) }
//>>excludeEnd('amdefine'); ----------------------------------------------------

define([
  './rest',
  './internal/tick'
], function (rest, tick) {

  return function (func, minDelay) {
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
})

