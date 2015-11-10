//>>excludeStart('amdefine', true);
if (typeof define !== 'function') { var define = require('amdefine')(module) }
//>>excludeEnd('amdefine'); ----------------------------------------------------

define(['./rest'], function (rest) {
  return function (func, arity) {
    switch (arity) {
      case 0: return function (ctx) {
        return func.call(ctx)
      }
      case 1: return function (ctx, a) {
        return func.call(ctx, a)
      }
      case 2: return function (ctx, a, b) {
        return func.call(ctx, a, b)
      }
      case 3: return function (ctx, a, b, c) {
        return func.call(ctx, a, b, c)
      }
      case 4: return function (ctx, a, b, c, d) {
        return func.call(ctx, a, b, c, d)
      }
      default: return rest(function (args) {
        return func.call.apply(func, args)
      })
    }
  }
})