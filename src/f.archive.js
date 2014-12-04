(function(){
   var 

   objectKeys = Object.keys || function (object){
    if (object == null) throw new TypeError('could not convert ' + object + ' to object');
    var keys = [], key, i = 0;
    for(key in object) if (objectHasOwnProperty.call(object, key)) keys[i++] = key;
    return keys;
  },
  objectForEach = function (fn, ctx){
    var object = this;
    if (object == null) throw new TypeError('could not convert ' + object + ' to object');    
    if (!isFunction(fn)) throw new TypeError(fn + ' is not a function.');
    arrayForEach.call(Object.keys(object), function(key){
      return fn.call(ctx, object[key], key, object);
    });
  }
  objectMap = function (fn, ctx){
    var mapped = {};
    objectForEach.call(this, function(value, key, object){
      mapped[key] = fn.call(ctx, value, key, object);
    });
    return mapped;
  },

  arrayForEach = array.forEach || function(fn, ctx){
    var array = this, len, i = 0;
    if (array == null) throw new TypeError('could not convert ' + array + ' to object');
    if (!isFunction(fn)) throw new TypeError(fn + ' is not a function.');
    array = Object(array);
    len = array.length >>> 0;
    for (i = 0; i < len; i++){
      if (false === fn.call(ctx, array[i], i, array)){
        break;
      }
    }
  },
  arrayMap = array.map || function (fn, ctx){
    var mapped = [];
    if (!isFunction(fn)) throw new TypeError(fn + ' is not a function.');
    arrayForEach.call(this, function(value, i, array){
      mapped.push(fn.call(ctx, value, i, array));
    });
    return mapped;
  },
  arrayReduce = array.reduce || function (array, fn, result, ctx){
    var array = this,
        len,
        i = 0,
        noinitial = arguments.length < 2;

    if (array == null) throw new TypeError('could not convert ' + array + ' to object');
    if (!isFunction(fn)) throw new TypeError(fn + ' is not a function.');

    array = Object(array);
    len = array.length >>> 0;

    if (len === 0){
      if (noinitial) throw new TypeError('reduce of empty array with no initial value');
      return result;
    }
    if (noinitial){
      if (len === 1) return array[0];
      result = array[i++];
    }
    for (; i < len; i++) result = fn.call(ctx, result, array[i], i, array);
    return result;
  };

}());