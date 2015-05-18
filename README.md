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
`...arg` | repeatable argument or none
`[...arg]` | array of arguments or empty array
`[,opt]` | optional argument
`[,opt=default]` | optional argument with default value
`a/b` | either `a` or `b`
__flags__ | __signature__
property | `f.VERSION`
native, uncurried | `f.apply(fn, ctx, [...arg])`
native, uncurried, shim | `f.bind(fn, ctx, ...arg)`
native, uncurried | `f.call(fn, ctx, ...arg)`
 | `f.chsig(fn, [...idx])`
native, uncurried, shim | `f.contains(array, item)`
 | `f.compose/f.o(into, from)`
 | `f.curry/f.c([argc=...arg.length,] fn, ...arg)`
 | `f.dot(object/array, key/index)`
 | `f.dotown(object, key)`
 | `f.dotset(object/array, key/index, value)`
native, uncurried, shim | `f.every(array, iter [,ctx])`
native, uncurried, shim | `f.filter(array, iter [,ctx])`
native, uncurried, shim | `f.forEach(array, iter [,ctx])`
 | `f.forOwn(object, iter [,ctx])`
 | `f.funcat(...fn)`
native, uncurried | `f.hasOwn(object, key)`
native, uncurried, shim | `f.indexOf(array, item [,offset=0])`
 | `f.isFunction(any)`
 | `f.isNative(any)`
native, shim | `f.keys(object)`
native, uncurried, shim | `f.lastIndexOf(array, item [,offset=0])`
native, uncurried, shim | `f.map(array, iter [,ctx])`
 | `f.noConflict()`
 | `f.range([start=0, [step=1,]] end)`
native, uncurried, shim | `f.reduce(array, iter [,aggregate])`
 | `f.reduceWith(array, iter [, ctx [,aggregate]])`
native, uncurried, shim | `f.reduceRight(array, iter [,aggregate])`
 | `f.reduceRightWith(array, iter [, ctx [,aggregate]])`
native, uncurried, shim | `f.some(array, iter [,ctx])`
 | `f.thisify(fn, ctx [,argc=fn.length])`
 | `f.uncurry(fn [,argc=fn.length])`

roadmap
-------
create a wrapper class with all of the above functions on its prototype. the one wrapped value of an instance would then be passed as the 1st argument to the original static function. then create a square matrix of all functions to indicate which method chains are allowed i.e. which return values are valid input arguments of/for which function(s). create a debug-build which enforces these rules and throws errors if broken, neglect these checks in production.

licence
-------
released under the [MIT][1] licence.

[1]: http://mariusrunge.com/mit-licence.html