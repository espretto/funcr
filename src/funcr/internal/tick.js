//>>excludeStart('amdefine', true);
if (typeof define !== 'function') { var define = require('amdefine')(module) }
//>>excludeEnd('amdefine'); ----------------------------------------------------

define(function () {

  var Date_ = Date // scope lift

  var now = Date_.now

  return typeof performance !== 'undefined'
    ? function () { return performance.now() }
    : (!now || 'prototype' in now)
    ? function () { return new Date_().getTime() }
    : now
})
