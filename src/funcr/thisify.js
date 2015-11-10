//>>excludeStart('amdefine', true);
if (typeof define !== 'function') { var define = require('amdefine')(module) }
//>>excludeEnd('amdefine'); ----------------------------------------------------

define([
  './rest',
  './internal/isContext'
], function (rest, isContext) {
  return function (func, ctx, arity) {
    if (!isContext(ctx)) return func

    switch (+arity === arity ? arity : func.length) {
      case 0: return function () {
        return func.call(ctx)
      }
      case 1: return function (a) {
        return func.call(ctx, a)
      }
      case 2: return function (a, b) {
        return func.call(ctx, a, b)
      }
      case 3: return function (a, b, c) {
        return func.call(ctx, a, b, c)
      }
      case 4: return function (a, b, c, d) {
        return func.call(ctx, a, b, c, d)
      }
      default: return rest(function (args) {
        func.apply(ctx, args)
      })
    }
  }
})