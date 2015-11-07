/*!
 * funcr released under MIT licence
 * http://mariusrunge.com/mit-licence.html
 */

var ns = require('./funcr/ns')

ns.append = require('./funcr/append')
ns.compose = require('./funcr/compose')
ns.curry = require('./funcr/curry')
ns.chsig = require('./funcr/chsig')
ns.debounce = require('./funcr/debounce')
ns.lift = require('./funcr/lift')
ns.memoize = require('./funcr/memoize')
ns.range = require('./funcr/range')
ns.rest = require('./funcr/rest')
ns.spread = require('./funcr/spread')
ns.thisify = require('./funcr/thisify')
ns.uncurry = require('./funcr/uncurry')

module.exports = ns
