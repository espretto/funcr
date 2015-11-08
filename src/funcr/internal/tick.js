/**
 * only suitable for measuring durations as accurately as
 * possible by browser means.
 */
var Date_ = Date // scope lift

var now = Date_.now

module.exports = typeof performance !== 'undefined'
  ? function () { return performance.now() }
  : (!now || 'prototype' in now)
  ? function () { return new Date_().getTime() }
  : now
