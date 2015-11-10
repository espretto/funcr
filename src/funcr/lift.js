//>>excludeStart('amdefine', true);
if (typeof define !== 'function') { var define = require('amdefine')(module) }
//>>excludeEnd('amdefine'); ----------------------------------------------------

define([
  './thisify',
  './internal/reduce',
  './internal/reduceRight'
], function (thisify, reduce, reduceRight) {
  return function (func, right) {
    return function (args, accum) {
      return (right ? reduceRight : reduce)(args, thisify(func, this, 4), accum)
    }
  }
})

