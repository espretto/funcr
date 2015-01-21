/*!
 * funcr javascript library released under MIT licence
 * http://mariusrunge.com/mit-licence.html
 */

(function (root, factory){

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    /* global define*/
    define(factory);
  } else {
    var f = factory(),
        prev = root.f;

    f.noConflict = function (){
      root.f = prev;
      return f;
    };
    root.f = f;
  }

}(this, function(){
  'use strict';

  // baseline setup
  // ============================
  
  // main object, also used as don't-care placeholder
  var f = { VERSION: '1.0.0' },

  // avoid fake global overrides
  Array = [].constructor,
  Object = f.constructor,

  arrayProto = Array.prototype,
  objectProto = Object.prototype,
  functionProto = Function.prototype,

  objectKeys = Object.keys,
  objectToString = objectProto.toString,
  objectHasOwnProperty = objectProto.hasOwnProperty,

  functionBind = functionProto.bind,
  functionCall = functionProto.call,
  functionApply = functionProto.apply,
  functionToString = functionProto.toString,

  arrayPush = arrayProto.concat,
  arrayIsArray = Array.isArray,

  // main - independent
  // ============================
  
  // since native code detection can always be tricked
  // we stick with the simple version
  isNative = f.isNative = function (fn) {
    return (
      typeof fn === 'function' &&
      functionToString.call(fn).indexOf('[native code]') !== -1
    );
  },

  baseForOwn = (isNative(objectKeys) ?
    function (object, fn) {
      f.forEach(objectKeys, function (key){
        return fn(object[key], key, object);
      });
    } :
    function (object, fn) {
      var key;
      if (object.hasOwnProperty) {
        for (key in object) {
          if (object.hasOwnProperty(key)) {
            if (fn(object[key], key, object) === false) break;
          }
        }
      } else {
        for (key in object) {
          if (objectHasOwnProperty.call(object, key)) {
            if (fn(object[key], key, object) === false) break;
          }
        }
      }
    }
  ), ///baseForOwn

  uncurry = function (fn){
    return function(){
      return functionCall.apply(fn, arguments);
    };
  },
  
  thisify = function (fn, ctx, argc) {
    return (
      argc === 1 ? function (a) { return fn.call(ctx, a); } :
      argc === 2 ? function (a, b) { return fn.call(ctx, a, b); } :
      argc === 3 ? function (a, b, c) { return fn.call(ctx, a, b, c); } :
      argc === 4 ? function (a, b, c, d) { return fn.call(ctx, a, b, c, d); } :
                   function () { return fn.apply(ctx, arguments); }
    );
  };

  f.thisify = thisify;

  f.uncurry = uncurry;

  f.call = uncurry(functionCall);

  f.apply = uncurry(functionApply);

  f.hasOwn = function (object, key) { // don't uncurry for speed
    return objectHasOwnProperty.call(object, key);
  };

  f.forOwn = function (object, fn, ctx) {
    baseForOwn(object, arguments.length > 2 ? thisify(fn, ctx, 3) : fn);
  };

  f.dot = function (object, key, value){
    return arguments.length > 2 ? (object[key] = value) : object[key];
  };

  f.o = function (fnA, fnB) {
    return function () {
      return fnA(fnB.apply(null, arguments));
    };
  };

  f.oWith = function (fnA, fnB) {
    return function () {
      return fnA.call(this, fnB.apply(this, arguments));
    };
  };

  // compat
  // ============================

  /* global COMPAT*/
  if (COMPAT) {

    // context-free polyfills
    // --------------------------

    var baseForEach = function (array, fn) {
      var len = array.length,
          i = -1;
      while (++i < len && fn(array[i], i, array) !== false);
    },

    baseSome = function (array, fn) {
      var len = array.length,
          i = -1;
      while (++i < len && !fn(array[i], i, array));
      return i !== len;
    },

    baseEvery = function (array, fn) {
      var len = array.length,
          i = -1;
      while (++i < len && fn(array[i], i, array));
      return i === len;
    },

    baseMap = function (array, fn) {
      var len = array.length,
          i = -1,
          mapped = new Array(len);

      while (++i < len) mapped[i] = fn(array[i], i, array);
      return mapped;
    },

    baseFilter = function (array, fn) {
      var len = array.length,
          i = -1,
          filtered = [],
          item;

      while (++i < len) {
        item = array[i];
        if (fn(item, i, array)) filtered.push(item);
      }
      return filtered; 
    },

    baseReduce = function (array, fn, accum_) {
      var accum = accum_,
          len = array.length,
          i = -1;
          
      if (arguments.length < 3) {
        if (!len) throw new TypeError('reduce of empty array with no initial value');
        accum = array[i=0]; // take and skip first
      }
      while (++i < len) accum = fn(accum, array[i], i+1, array);
      return accum;
    },

    baseReduceRight = function (array, fn, accum_) {
      var accum = accum_,
          i = array.length;
          
      if (arguments.length < 3) {
        if (!i) throw new TypeError('reduce of empty array with no initial value');
        accum = array[--i]; // take and skip last
      }
      while (i--) accum = fn(accum, array[i], i, array);
      return accum;
    };

    // static function polyfills
    // --------------------------

    var compat = {

      indexOf: function (array, item, offset) {
        var len = array.length,
            i = (+offset || 0) - 1;

        while (++i < len && array[i] !== item);
        return i % len || -1;
      },

      lastIndexOf: function (array, item, offset_) {
        var offset = +offset_ || 0;
        for (var i = array.length; i-- > offset && array[i] !== item;);
        return i;
      },

      contains: function (array, item){
        return f.indexOf(array, item) !== -1;
      },

      some: function (array, fn, ctx){
        return baseSome(array, arguments.length > 2 ? thisify(fn, ctx, 3) : fn);
      },

      every: function (array, fn, ctx){
        return baseEvery(array, arguments.length > 2 ? thisify(fn, ctx, 3) : fn);
      },

      forEach: function (array, fn, ctx){
        baseForEach(array, arguments.length > 2 ? thisify(fn, ctx, 3) : fn);
      },

      map: function (array, fn, ctx) {
        return baseMap(array, arguments.length > 2 ? thisify(fn, ctx, 3) : fn);
      },

      filter: function (array, fn, ctx) {
        return baseFilter(array, arguments.length > 2 ? thisify(fn, ctx, 3) : fn);
      },

      reduce: function (array, fn, accum, ctx) {
        var argc = arguments.length;
        return (
          argc > 3 ? baseReduce(array, thisify(fn, ctx, 4), accum) :
          argc > 2 ? baseReduce(array, fn, accum) :
                     baseReduce(array, fn)
        );
      },

      reduceRight: function (array, fn, accum, ctx) {
        var argc = arguments.length;
        return (
          argc > 3 ? baseReduceRight(array, thisify(fn, ctx, 4), accum) :
          argc > 2 ? baseReduceRight(array, fn, accum) :
                     baseReduceRight(array, fn)
        );
      }
    };

    // patch if not native
    // --------------------------
    
    f.forOwn(compat, function(staticFn, name){
      var protoFn = arrayProto[name];
      f[name] = isNative(protoFn) ? uncurry(protoFn) : staticFn;
    });

    if (!isNative(arrayIsArray)) {
      var arrayRepr = '[object Array]';
      f.isArray = function (x){ return objectToString.call(x) === arrayRepr; };
    }

    if (!isNative(functionBind)) {
      f.bind = function(fn, ctx, ...args){
        var noop = function () {};
        function bound() {
          /*jshint validthis: true */
          var brgs = args.slice();
          arrayPush.apply(brgs, arguments);
          return fn.apply(this instanceof noop && ctx ? this : ctx, brgs);
        }
        noop.prototype = fn.prototype;
        bound.prototype = new noop();
        return bound;
      };
    }
  } else {

    // adopt/uncurry natives
    // --------------------------
    
    ('indexOf,lastIndexOf,contains,some,' +
      'every,map,forEach,filter,reduce,reduceRight'
    ).split(',').forEach(function (name){
      var fn = Array[fn];
      f[name] = isNative(fn) ? fn : uncurry(arrayProto[name]);
    });

    f.isArray = arrayIsArray;

    f.bind = uncurry(functionBind);
  }

  // main - dependent
  // ============================

  f.curry = function (/*[fnLength]*/ fn, ...args){
    var argc,
        fnLength,
        f_ = f; // lift to scope

    // swap arguments as needed
    if (typeof fn === 'number'){
      fnLength = fn;
      fn = args.shift();
    } else {
      fnLength = fn.length;
    }

    // fill up with don't-cares in case curried with less args than required.
    for (argc = args.length; argc < fnLength;) argc = args.push(f_);

    return function (...brgs){
      var crgs,
          f = f_; // lift to scope again
      
      crgs = f.map(args, function(arg){
        return arg !== f ? arg : brgs.shift();
      });

      arrayPush.apply(crgs, brgs);
      if (!crgs.contains(f)) return fn.apply(this, crgs);
      crgs.unshift(fn);
      return f.curry.apply(null, crgs);
    };
  };

  f.chsig = function (fn, ...indices){
    return function (...args){
      return fn.apply(this, f.map(indices, function (index) {
        return args[index];
      }));
    };
  };

  // lifted to arrays
  // ----------------
  
  f.oAll = f.curry(f.reduce, f, f.o);
  f.oAllWith = f.curry(f.reduce, f, f.oWith);

  return f;
}));
