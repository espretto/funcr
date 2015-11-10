funcr
=====
utility library to help write functional javascript code.

usage
-----
_funcr_ modules are written in _AMD_ syntax with an [amdefine][2]-header to support
_CommonJS_ environments. assignments to the global `exports` object or per-module
globals are not supported. however, the standalone builds do have an _UMD_-wrapper.
```
npm install

# unwrapped rjs-build
grunt requirejs:extension

# umd-wrapped standalone with almond
grunt requirejs:standalone

# umd-wrapped standalone with webpack
grunt webpack:standalone

# convenience
npm run gzip
ls -la ./built
```

minified build            | size
------------------------- | ----
funcr.amd-0.7.0.js        | 4.4kb
funcr.amd-0.7.0.js.gz     | 1.5kb
funcr.almond-0.7.0.js     | 7.6kb
funcr.almond-0.7.0.js.gz  | 2.9kb
funcr.webpack-0.7.0.js    | 5.3kb
funcr.webpack-0.7.0.js.gz | 1.5kb

__note:__ the _amdefine_-headers are stripped by each build using either anonymous
build-pragmas (requirejs) or dead/unreachable code removal (webpack).

reference
---------------
- `append(to, from)`
- `array(length)`
- `chsig(fn, ...idx)`
- `compose(into, from)`
- `curry(fn/ctx, ctx/fnName, ...arg)`
- `debounce(fn, minDelay)`
- `lift(fn [,right=false])`
- `memoize(fn [,hashFn])`
- `range([start=0, [step=1,]] end)`
- `rest(fn [,offset=fn.length-1])`
- `spread(fn [,limit])`
- `thisify(fn, ctx [,arity=fn.length])`
- `uncurry(fn [,argc=fn.length])`



licence
-------
released under the [MIT][1] licence.

[1]: http://mariusrunge.com/mit-licence.html
