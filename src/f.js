
(function(root){
	'use strict';

	var // one to var them all

	// baseline setup
	// --------------
	f = {},
	_ = null, // don't care
	array = [],
	
	Array = array.constructor,

	// shortcuts / polyfills
	// ---------------------
	objectHasOwnProperty = f.hasOwnProperty,

	functionCall = Array.call,
	functionApply = Array.apply,
	functionBind = Array.bind, uncurriedBind,

	arrayConcat = array.concat,

	arrayOf = Array.of || function(){
		var args = arguments,
				i = args.length,
				array = new Array(i);
		while(i--) array[i] = args[i];
		return array;
	};

	// main
	// ----
	f.VERSION = '0.0.1';

	f.o = function (/* ...fns*/){
		var fns = arrayOf.apply(_, arguments),
				i = fns.length;

		if (!i) throw new TypeError('reduce of empty array with no initial value');

		return i === 1 ? fns[0] : function (){
			var args = fns[--i].apply(this, arguments);
			while (i--) args = fns[i].call(this, args);
			return args;
		};
	};

  f.uncurry = function (fn){
		return function(){
			return functionCall.apply(fn, arguments);
		};
	};

	f.curry = function (/* [fnlen,] fn, ...args*/){
		var args = arrayOf.apply(_, arguments),
				fnlen = args.shift(),
				fn,
				alen;

		if (typeof fnlen === 'number'){
			fn = args.shift();
		} else {
			fn = fnlen;
			fnlen = fn.length;
		}

		// fill up with don't-cares in case curried with less args than required.
		for (alen = args.length; alen < fnlen;) alen = args.push(f);

		return function (/* ...brgs*/){

			// copy the given `args`
			var brgs = args.slice(), blen = alen, b = 0,
					crgs = arguments, clen = crgs.length, c = 0;

			// merge this call's arguments into them
			for (; c < clen && b < blen; b++) if (brgs[b] === f) brgs[b] = crgs[c++];

			// append the remaining ones
			for (; c < clen; c++) blen = brgs.push(crgs[c]);
			
			// if `f` is still among the resulting arguments
			for (; blen-- && brgs[blen] !== f;);

			// call `fn` with them
			if (blen === -1) return fn.apply(this, brgs);

			// or recurry `fn` otherwise
			brgs.unshift(fn);
			return f.curry.apply(_, brgs);

			// ~1/3 slower functional equivalent of the above
			// ```
			// var brgs = Array.of.apply(_, arguments),
			// 		crgs = args.map(function(arg){
			// 			return arg === f && brgs.length ? brgs.shift() : arg;
			// 		}).concat(brgs);

			// if (!crgs.contains(f)) return fn.apply(this, crgs);
			// else return crgs.unshift(fn), f.curry.apply(_, crgs);
			// ```
		};
	};

	f.chsig = function (/* fn, ...indices*/){
		var indices = arrayOf.apply(_, arguments),
				fn = indices.shift();
		return function (){
			var i = indices.length,
					args = new Array(i);
			while (i--) args[i] = arguments[indices[i]];
			return fn.apply(this, args);
		};
	};

	uncurriedBind = functionBind && f.uncurry(functionBind);

	f.call = f.curry(f.uncurry(functionCall));
	f.apply = f.curry(f.uncurry(functionApply));
	f.invoke = f.call(f, _); // where `_ == null`
	f.bind = uncurriedBind ? f.curry(uncurriedBind) : f.curry(f.curry, f.call);
	f.bindConstructor = f.curry(uncurriedBind || function(/* fn, ctx, ...args*/){
		var args = arrayOf.apply(_, arguments),
				fn = args.shift(),
				ctx = args.shift(),
				noop = function (){};

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

	f.id = function (a){ return a; };
	f.not = function (a){ return !a; };
	f.raise = function (a){ throw a; };
	f.has = f.call(objectHasOwnProperty, f, f);
	f.dot = f.curry(2, function (object, key, value){
		return arguments.length > 2	? (object[key] = value) : object[key];
	});

	// ```es6
	// f.create = function (constructor, ...args){
	// 	return new constructor(...args);
	// };
	// ```

	// export
	// ------

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = f;
	} else if (typeof define === 'function' && define.amd) {
		/* global define*/
		define(function (){ return f; });
	} else {
		var prev = root.f;
		f.noConflict = function () {
			root.f = prev;
			return f;
		};
		root.f = f;
	}

}(this));
