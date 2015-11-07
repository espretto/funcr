/**
 * only suitable for measuring durations as accurately as
 * possible by browser means.
 */

var tick = (typeof performance !== 'undefined' ? performance : Date).now

if (!tick || 'prototype' in tick) {
  tick = function () {
    return new Date().getTime()
  }
}

module.exports = tick
