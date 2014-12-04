
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
	functionBind = Array.bind,
	functionApply = Array.apply,

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

	f.o = function (/* fn, ..*/){
		var fns = arrayOf.apply(_, arguments),
				i = fns.length;

		if (i < 2) throw new TypeError('reduce of empty array with no initial value');

		return i === 1 ? fns[0] : function (){
			var args = fns[--i].apply(_, arguments);
			while (i--) args = fns[i].call(this, args);
			return args;
		};
	};

  f.uncurry = function (fn){
		return function(){
			return functionCall.apply(fn, arguments);
		};
	};

	f.curry = function (/* [fnlen,] fn, arg, ..*/){
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

		return function (/* brg, ..*/){
			// copy curried args, merge arguments into them and append remaining ones.
			// recurry if `f` is still found, call fn otherwise.
			var brgs = args.slice(), blen = alen, b = 0,
					crgs = arguments, clen = crgs.length, c = 0;

			for (; c < clen && b < blen; b++) if (brgs[b] === f) brgs[b] = crgs[c++];
			for (; c < clen; c++) blen = brgs.push(crgs[c]);
			for (; blen-- && brgs[blen] !== f;);
			if (blen === -1) return fn.apply(this, brgs);
			brgs.unshift(fn);
			return f.curry.apply(_, brgs);
		};
	};

	f.chsig = function (/* fn, i, ..*/){
		var indices = arrayOf.apply(_, arguments);
		return function (){
			var i = indices.length,
					args = new Array(i);
			while (--i) args[i] = arguments[indices[i]]; // skip fn
			return indices[0].apply(this, args);
		};
	};

	var uncurriedBind = functionBind && f.uncurry(functionBind);

	f.call = f.curry(f.uncurry(functionCall));
	f.apply = f.curry(f.uncurry(functionApply));
	f.invoke = f.call(f, null);
	f.bind = uncurriedBind ? f.curry(uncurriedBind) : f.curry(f.curry, f.call);
	f.bindConstructor = f.curry(uncurriedBind || function(/* fn, ctx, arg, ..*/){
		var args = arrayOf.apply(_, arguments),
				fn = args.shift(),
				ctx = args.shift(),
				noop = function (){};

		function bound(){
			/*jshint validthis: true */
			return fn.apply(
				this instanceof noop && ctx ? this : ctx,
				arrayConcat.apply(args, arguments) // copy, don't merge
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

	// export
	// ------

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = f;
	} else if (typeof define === 'function' && define.amd) {
		/* global define*/
		define(function (){ return f; });
	} else {
		/**
		* restores the previous value assigned to `window.f`
		* and returns the inner reference f holds to itself.
		* @function f.noConflict
		* @return {f}
		*/
		var prev = root.f;
		f.noConflict = function () {
			root.f = prev;
			return f;
		};
		root.f = f;
	}

}(this));
