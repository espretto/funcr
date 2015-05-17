funcr
=====
utility library to help write functional javascript code.

quick reference
---------------
flag/notation | meaning
---|---
property | simple property
native | adopted if natively available
uncurried | wrapped by function to take context as 1st argument
shim | shimmed/polyfilled if not natively available
`...arg` | repeatable argument
`[...arg]` | array of arguments
`[, opt]` | optional argument
`a/b` | either `a` or `b`

flags | signature
---|---
property | `f.VERSION`
native, uncurried | `f.apply(fn, ctx, [...arg])`
native, uncurried, shim | `f.bind(fn, ctx, ...arg)`
native, uncurried | `f.call(fn, ctx, ...arg)`
 | `f.chsig(fn, [...idx])`
native, uncurried, shim | `f.contains(array, item)`
 | `f.curry(fn, ...arg)`
 | `f.dot(object/array, key/index)`
 | `f.dotset(object/array, key/index, value)`
native, uncurried, shim | `f.every(array, iter [, ctx])`
native, uncurried, shim | `f.filter(array, iter [, ctx])`
native, uncurried, shim | `f.forEach(array, iter [, ctx])`
 | `f.forOwn(object, iter [, ctx])`
 | `f.funcat(...fn)`
native, uncurried | `f.hasOwn(object, key)`
native, uncurried, shim | `f.indexOf(array, item [, offset])`
 | `f.isFunction(any)`
 | `f.isNative(any)`
native, shim | `f.keys(object)`
native, uncurried, shim | `f.lastIndexOf(array, item [, offset])`
native, uncurried, shim | `f.map(array, iter [, ctx])`
 | `f.noConflict()`
 | `f.o(into, from)`
native, uncurried, shim | `f.reduce(array, iter [, aggregate])`
 | `f.reduceWith(array, iter [, ctx [, aggregate]])`
native, uncurried, shim | `f.reduceRight(array, iter [, aggregate])`
 | `f.reduceRightWith(array, iter [, ctx [, aggregate]])`
native, uncurried, shim | `f.some(array, iter [, ctx])`
 | `f.thisify(fn, ctx [, fnLength])`
 | `f.uncurry(fn [, fnLength])`

licence
-------
released under the [MIT][1] licence.

[1]: http://mariusrunge.com/mit-licence.html