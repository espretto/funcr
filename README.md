funcr
=====
utility library to help write functional javascript code.

quick reference
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

build
-----
modules are written in CommonJS.
```
npm install -g webpack
npm install
npm run build
npm run gzip
```

licence
-------
released under the [MIT][1] licence.

[1]: http://mariusrunge.com/mit-licence.html
