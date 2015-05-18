/*!
 * funcr javascript library released under MIT licence
 * http://mariusrunge.com/mit-licence.html
 */

/* global __COMPAT__, __VERSION__*/

(function (root, factory) {

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

  /* ---------------------------------------------------------------------------
   * baseline setup
   */
  
  var f = { VERSION: __VERSION__ },

  STR_PROTOTYPE = 'prototype',
  STR_CONSTRUCTOR = 'constructor',
  STR_OBJECT_FUNCTION = '[object Function]',
  STR_FUNCTION = 'function',

  getContext = function () { return this; },
  globalContext = getContext(),

  // avoid fake global overrides
  Array = [][STR_CONSTRUCTOR],
  Object = f[STR_CONSTRUCTOR],
  Number = (1)[STR_CONSTRUCTOR],
  Function = getContext[STR_CONSTRUCTOR],

  arrayProto = Array[STR_PROTOTYPE],
  objectProto = Object[STR_PROTOTYPE],
  functionProto = Function[STR_PROTOTYPE],

  arrayPush = arrayProto.push,
  functionBind = functionProto.bind,
  objectToString = objectProto.toString,
  mathMax = Math.max,

  /* ---------------------------------------------------------------------------
   * main
   */
  
  isFunction = f.isFunction = typeof /r/ === STR_FUNCTION ? function(fn){
    return objectToString.call(fn) === STR_OBJECT_FUNCTION;
  } : function (fn) {
    return typeof fn === STR_FUNCTION;
  },

  isNative = f.isNative = function (any) {
    return isFunction(any) && !(STR_PROTOTYPE in any);
  },

  toInteger = f.toInteger = Number.toInteger || function (n) {
    return (n = +n) ? isFinite(n) ? n - (n%1) : n : 0;
  },

  uncurry = f.uncurry = function (fn, argc_){
    var argc = argc_ || fn.length;
    return (
      argc === 0 ? function (ctx) { return fn.call(ctx); } :
      argc === 1 ? function (ctx, a) { return fn.call(ctx, a); } :
      argc === 2 ? function (ctx, a, b) { return fn.call(ctx, a, b); } :
      argc === 3 ? function (ctx, a, b, c) { return fn.call(ctx, a, b, c); } :
                   function (ctx, ...args) { return fn.apply(ctx, args); }
    );
  },
  
  thisify = f.thisify = function (fn, ctx, argc_) {
    var argc = argc_ || fn.length;
    return (
      (ctx == null || ctx === globalContext) ? fn :
      argc === 0 ? function () { return fn.call(ctx); } :
      argc === 1 ? function (a) { return fn.call(ctx, a); } :
      argc === 2 ? function (a, b) { return fn.call(ctx, a, b); } :
      argc === 3 ? function (a, b, c) { return fn.call(ctx, a, b, c); } :
      argc === 4 ? function (a, b, c, d) { return fn.call(ctx, a, b, c, d); } :
                   function (...args) { return fn.apply(ctx, args); }
    );
  };

  f.call = uncurry(functionProto.call);
  f.apply = uncurry(functionProto.apply);

  f.dot = function (object, key){
    return object[key];
  };

  f.dotown = function (object, key) {
    return hasOwn(object, key) && object[key] || f;
  };

  f.dotset = function (object, key, value){
    return (object[key] = value);
  };

  f.compose = function (into, from) {
    return function () {
      var arguments_ = arguments,
          argc = arguments_.length;

      if (argc < 4) {
        return into(
          argc === 0 ? from() :
          argc === 1 ? from(arguments_[0]) :
          argc === 2 ? from(arguments_[0], arguments_[1]) :
                       from(arguments_[0], arguments_[1], arguments_[2])
        );
      } else {
        var args = new Array(argc);
        args[0] = args; // preset as variatically typed array
        while (argc--) args[argc] = arguments_[argc];
        return into(from.apply(null, args));
      }
    };
  };

  f.funcat = function (...fns){
    return function (...args) {
      return f.map(fns, function(fn){
        var fnLength = fn.length;
        return (
          fnLength === 0 ? fn() :
          fnLength === 1 ? fn(args.shift()) :
          fnLength === 2 ? fn(args.shift(), args.shift()) :
          fnLength === 3 ? fn(args.shift(), args.shift(), args.shift()) :
                           fn.apply(null, args.splice(0, fnLength))
        );
      });
    };
  };

  f.curry = function (/*[fnLength]*/ fn_, ...args){

    // `fn` may be reassigned and we're mentioning `arguments`
    var fn = fn_,
        argc,
        fnLength;

    // swap arguments as needed
    if (isFunction(fn)){
      fnLength = fn.length;
    } else {
      fnLength = fn;
      fn = args.shift();
    }  
    
    // fill up with don't-cares in case curried with less args than required.
    for (argc = args.length; argc < fnLength;) argc = args.push(f);

    return function (...brgs){
      var crgs = f.map(args, function(arg){
        return arg !== f ? arg : brgs.shift();
      });

      arrayPush.apply(crgs, brgs);

      if (!f.contains(crgs, f)) return fn.apply(null, crgs);
      
      crgs.unshift(fn);
      return f.curry.apply(null, crgs);
    };
  };

  f.chsig = function (fn, ...indices_){
    return function (...args_){
      var len = args_.length,
          indices = f.map(indices_, function (index) {
            return index < 0 ? mathMax(0, index + len) : index;
          }),
          args = f.map(indices, function (index) {
            return args_[index];
          });

      if (indices.length) arrayPush.apply(args, args_.slice(mathMax.apply(null, indices)));

      return fn.apply(null, args);
    };
  };

  f.range = function (start, step, end) {
    var argc = arguments.length,
        start_ = start,
        step_ = step,
        end_ = end,
        result = [];

    if (argc < 2) start_ = 0, step_ = 1, end_ = start || 0;
    else if (argc < 3)        step_ = 1, end_ = step;

    for (; start_ < end_; start_ += step_) result.push(start_);
    return result;
  };

  /* ---------------------------------------------------------------------------
   * Object functions
   */

  var objectKeys = Object.keys,
      hasOwn = f.hasOwn = uncurry(objectProto.hasOwnProperty, 1),
      baseForOwn; // lazy def

  if (__COMPAT__ && !isNative(objectKeys)) {
    
    objectKeys = function (object) {
      var keys = [];
      for (var key in object) if (hasOwn(object, key)) keys.push(key);
      return keys;
    };

    // if Object.keys isn't natively available avoid iterating twice,
    // once for the keys and once for the values.
    baseForOwn = function (object, fn) {
      for (var key in object) {
        if (hasOwn(object, key) && fn(object[key], key, object) === false) {
          break;
        }
      }
    };
    
  } else {
    baseForOwn = function (object, fn) {
      // if `Object.keys` is native `forEach` is, too.
      objectKeys(object).forEach(function (key) {
        return fn(object[key], key, object);
      });
    };
  }

  f.keys = objectKeys;

  f.forOwn = function (object, fn, ctx) {
    baseForOwn(object, thisify(fn, ctx, 3));
  };

  /* ---------------------------------------------------------------------------
   * Array functions
   */

  if (__COMPAT__) {

    var compat = {

      forEach: function (array, fn) {
        var len = array.length,
            i = -1;
        while (++i < len && fn(array[i], i, array) !== false);
      },

      some: function (array, fn) {
        var len = array.length,
            i = -1;
        while (++i < len && !fn(array[i], i, array));
        return i !== len;
      },

      every: function (array, fn) {
        var len = array.length,
            i = -1;
        while (++i < len && fn(array[i], i, array));
        return i === len;
      },

      map: function (array, fn) {
        var len = array.length,
            i = -1,
            mapped = new Array(len);

        while (++i < len) mapped[i] = fn(array[i], i, array);
        return mapped;
      },

      filter: function (array, fn) {
        var len = array.length,
            i = -1,
            j = -1,
            filtered = [],
            item;

        while (++i < len) {
          item = array[i];
          if (fn(item, i, array)) filtered[++j] = item;
        }
        return filtered; 
      }
    };

    baseForOwn(compat, function (baseFn, fnName, compat) {
      var thisify = thisify; // lift to scope
      compat[fnName] = function (array, fn, ctx) {
        return baseFn(array, thisify(fn, ctx, 3));
      };
    });

    compat.indexOf = function (array, item, offset) {
      var len = array.length,
          i = (+offset || 0) - 1;

      while (++i < len) if (array[i] === item) return i;
      return -1;
    };

    compat.lastIndexOf = function (array, item, offset) {
      var i = array.length;
      offset = (+offset || 0);

      while (offset < i--) if (array[i] === item) return i;
      return -1;
    };

    compat.contains = function (array, item){
      return f.indexOf(array, item) !== -1;
    };

    compat.reduce = function (array, fn, aggregate) {
      var aggregate_ = aggregate,
          len = array.length,
          i = -1;
          
      if (arguments.length < 3) {
        if (!len) throw new TypeError('reduce of empty array with no initial value');
        aggregate_ = array[++i]; // take and skip first
      }
      while (++i < len) aggregate_ = fn(aggregate_, array[i], i, array);
      return aggregate_;
    };

    compat.reduceRight = function (array, fn, aggregate) {
      var aggregate_ = aggregate,
          i = array.length;
          
      if (arguments.length < 3) {
        if (!i) throw new TypeError('reduce of empty array with no initial value');
        aggregate_ = array[--i]; // take and skip last
      }
      while (i--) aggregate_ = fn(aggregate_, array[i], i, array);
      return aggregate_;
    };

    baseForOwn(compat, function(staticFn, fnName){
      var protoFn = arrayProto[fnName];
      f[fnName] = isNative(protoFn) ? uncurry(protoFn) : staticFn;
    });

  } else {
    ('contains,every,filter,forEach,indexOf,lastIndexOf,map,reduce,reduceRight,some')
    .split(',')
    .forEach(function (fnName) {
      var fn = Array[fnName];
      f[fnName] = isNative(fn) ? fn : uncurry(arrayProto[fnName]);
    });
  }

  /* ---------------------------------------------------------------------------
   * Array reduce[Right] with context
   */

  f.forEach(['reduce', 'reduceRight'], function (fnName) {
    var reducer = f[fnName];

    f[fnName + 'With'] = function (array, fn, ctx, aggregate) {
      var argc = arguments.length;
      return (
        argc > 3 ? reducer(array, thisify(fn, ctx, 4), aggregate) :
        argc > 2 ? reducer(array, thisify(fn, ctx, 4)) :
                   reducer(array, fn)
      );
    };
  });

  /* ---------------------------------------------------------------------------
   * Function functions
   */

  if (__COMPAT__ && !isNative(functionBind)) {
    f.bind = function (fn, ctx, ...args){
      var noop = function () {};
      function bound (...brgs) {
        /*jshint validthis: true */
        return fn.apply(
          this instanceof noop && ctx ? this : ctx,
          args.concat(brgs)
        );
      }
      noop[STR_PROTOTYPE] = fn[STR_PROTOTYPE];
      bound[STR_PROTOTYPE] = new noop();
      return bound;
    };
  } else {
    f.bind = uncurry(functionBind);
  }

  /* ---------------------------------------------------------------------------
   * aliases
   */
  
  f.o = f.compose;
  f.c = f.curry;
  
  /* ---------------------------------------------------------------------------
   * export
   */

  return f;
}));
