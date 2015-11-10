//>>excludeStart('amdefine', true);
if (typeof define !== 'function') { var define = require('amdefine')(module) }
//>>excludeEnd('amdefine'); ----------------------------------------------------

define([
  './ns',
  './rest',
  './append',
  './internal/map',
  './internal/lastIndexOf'
], function (ns, rest, append, map, lastIndexOf) {

  function merge (array, brray) {
    return append(map(array, function (arg) {
      return brray.length && arg === ns.arg
        ? brray.shift()
        : arg
    }), brray)
  }

  return rest(function curry (args) {
    return rest(function (brgs) {
      var crgs = merge(args, brgs)

      if (lastIndexOf(crgs, ns.arg) < 0) {
        var func = crgs.shift()
        var ctx = crgs.shift()

        if (ctx === ns.that) ctx = this
        if (typeof func === 'string') func = ctx[func]

        return func.apply(ctx, crgs)
      } else {
        return curry(crgs)
      }
    })
  })
})
