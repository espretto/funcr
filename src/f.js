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

  var // one to var them all

  // baseline setup
  // --------------
  f = {}, // also used as blank argument
  array = [],
  Array = array.constructor, // don't be fooled by global override
  _ = null, // don't care
  defaultContext = (function (){ return this; }()),
  
  // shortcuts / polyfills
  // ---------------------
  objectHasOwnProperty = f.hasOwnProperty,

  functionCall = Array.call,
  functionApply = Array.apply,
  functionBind = Array.bind, uncurriedBind,

  arrayConcat = array.concat;

  // main
  // ----
  f.VERSION = '0.0.1';

  f.o = function (...fns){
    var i = fns.length,
        defaultContext_ = defaultContext;

    if (!i) throw new TypeError('reduce of empty array with no initial value');

    return i === 1 ? fns[0] : function (){
      var fns_ = fns, // lift to scope
          i_ = i,
          fn = fns_[--i_],
          args = arguments, // promote compression
          len = args.length,
          that = this,
          result;

      // try to avoid using `.call()` or `.apply()`
      if (that === defaultContext_) {
        if (!len) result = fn();
        else if (len == 1) result = fn(args[0]);
        else result = fn.apply(that, args);
        while (i_--) result = fns_[i_](result);
      } else {
        result = fn.apply(that, args);
        while (i_--) result = fns_[i_].call(that, result);
      }

      return result;
    };
  };

  f.uncurry = function (fn){
    return function(){
      return functionCall.apply(fn, arguments);
    };
  };

  f.curry = function (fn, ...args){
    var alen,
        fnlen,
        f_ = f; // lift to scope

    // mangle arguments as needed
    if (typeof fn === 'number'){
      fnlen = fn;
      fn = args.shift();
    } else {
      fnlen = fn.length;
    }

    // fill up with don't-cares in case curried with less args than required.
    for (alen = args.length; alen < fnlen;) alen = args.push(f_);

    // since we don't leak `crgs` anywhere we don't have toArray them
    return function (/* ...crgs*/){
      // 1. copy the given `args`
      var brgs = args.slice(),
          blen = alen,
          b = 0,
          crgs = arguments,
          clen = crgs.length,
          crg,
          c = 0,
          incomplete = 0,
          f_ = f; // lift to scope

      // 2. fill blanks with `arguments`
      for (; c < clen && b < blen; b++) {
        if (brgs[b] === f_){
          crg = crgs[c++];
          brgs[b] = crg;
          if (crg === f_) incomplete++;
        }
      }

      // 2.1 watch out for 
      if (!incomplete){
        for (; b < blen; b++){
          if (brgs[b] === f_){
            incomplete++;
            break;
          }
        }
      }

      // 3. append the remaining ones
      if (incomplete) {
        for (; c < clen; c++){
          brgs.push(crgs[c]);
        }
      } else {
        for (; c < clen; c++) {
          crg = crgs[c];
          brgs.push(crg);
          if (crg === f_) incomplete++;
        }
      }
      
      // 4.1 if `f` is still among the arguments, recurry
      if (incomplete) {
        brgs.unshift(fn);
        return f_.curry.apply(_, brgs);
      }

      // 4.2 finally call the function otherwise.
      // functions passed are expexted bute not required
      // to take more than one argument. don't try to avoid `.apply()`.
      return fn.apply(this, brgs);

      // ~1/3 slower functional equivalent of the above
      // ```
      // var brgs = Array.of.apply(null, arguments), crgs;
      // 
      // crgs = args
      //   .map(function(arg){
      //     return arg === f && brgs.length ? brgs.shift() : arg;
      //   })
      //   .concat(brgs);
      //
      // if (!crgs.contains(f)) return fn.apply(this, crgs);
      // crgs.unshift(fn);
      // return f.curry.apply(_, crgs);
      // ```
    };
  };

  f.chsig = function (fn, ...indices){
    var i = indices.length;

    return function (){
      var indices_ = indices, // lift to scope
          i_ = i,
          args = new Array(i_);

      while (i_--) args[i_] = arguments[indices_[i_]];

      // functions passed are expexted bute not required
      // to take more than one argument. don't try to avoid `.apply()`.
      return fn.apply(this, args);
    };
  };

  uncurriedBind = functionBind && f.uncurry(functionBind);

  f.call = f.curry(f.uncurry(functionCall));
  f.apply = f.curry(f.uncurry(functionApply));
  f.invoke = f.call(f, defaultContext);
  f.bind = uncurriedBind ? f.curry(uncurriedBind) : f.curry(f.curry, f.call);
  f.bindConstructor = f.curry(uncurriedBind || function(fn, ctx, ...args){
    var noop = function (){};

    function bound(){
      /*jshint validthis: true */
      return fn.apply(
        this instanceof noop && ctx ? this : ctx,
        arrayConcat.apply(args, arguments) // copy, don't side-effectivly merge
      );
    }

    noop.prototype = fn.prototype;
    bound.prototype = new noop();
    return bound;
  });

  f.has = f.call(objectHasOwnProperty, f, f);
  f.dot = f.curry(2, function (object, key, value){
    return arguments.length > 2 ? (object[key] = value) : object[key];
  });

  return f;
}));
