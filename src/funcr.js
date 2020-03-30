//>>excludeStart('amdefine', true);
if (typeof define !== 'function') { var define = require('amdefine')(module) }
//>>excludeEnd('amdefine'); ----------------------------------------------------

/*!
 * funcr released under MIT licence
 */
define([
  './funcr/ns',

  './funcr/append',
  './funcr/compose',
  './funcr/curry',
  './funcr/chsig',
  './funcr/debounce',
  './funcr/lift',
  './funcr/memoize',
  './funcr/range',
  './funcr/rest',
  './funcr/spread',
  './funcr/thisify',
  './funcr/uncurry',
], function (ns, append, compose, curry, chsig, debounce, lift, memoize, range, rest, spread, thisify, uncurry) {

  ns.append = append;
  ns.compose = compose;
  ns.curry = curry;
  ns.chsig = chsig;
  ns.debounce = debounce;
  ns.lift = lift;
  ns.memoize = memoize;
  ns.range = range;
  ns.rest = rest;
  ns.spread = spread;
  ns.thisify = thisify;
  ns.uncurry = uncurry;

  return ns;
})
