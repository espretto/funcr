f.indexOf = function (array, item){
  for (var i = array.length; i-- && array[i] !== item;);
  return i;
};

f.contains = function(array, item){
  return f.indexOf(array, item) !== -1;
};

f.some = function (array, fn, ctx){
  var len = array.length,
      i = -1;
  if (ctx === defaultContext) {
    while (++i < len && !fn(array[i], i, array));
  } else {
    while (++i < len && !fn.call(ctx, array[i], i, array));
  }
  return i === len;
};

f.forEach = function(array, fn, ctx){
  var len = array.length,
      i = -1;
  if (ctx === defaultContext) {
    while(++i < len && fn(array[i], i, array) !== false);
  } else {
    while(++i < len && fn.call(ctx, array[i], i, array) !== false);
  }
};

f.map = function (array, fn, ctx) {
  var len = array.length,
      i = -1,
      mapped = new Array(len);

  if (ctx === defaultContext) {
    while(++i < len) mapped[i] = fn(array[i], i, array);
  } else {
    while(++i < len) mapped[i] = fn.call(ctx, array[i], i, array);
  }
};

f.filter = function (array, fn, ctx) {
  var len = array.length,
      i = -1,
      filtered = [],
      item;

  if (ctx === defaultContext) {
    while(++i < len) {
      item = array[i];
      if (fn(item, i, array)) filtered.push(item);
    }
  } else {
    while(++i < len) {
      item = array[i];
      if (fn.call(ctx, item, i, array)) filtered.push(item);
    }
  }
};

f.reduce = function (array, fn, result, ctx) {
  var argc = arguments.length,
      len = array.length,
      i = -1;
      
  if (argc < 3) {
    if (!len) throw new TypeError('reduce of empty array with no intial value');
    result = array[0];
    i++;
    while (++i < len) result = fn(result, array[i]);
  } else if (argc < 4) {
    if (!len) return result;
    while (++i < len) result = fn(result, array[i]);
  } else {
    if (!len) return result;
    while (++i < len) result = fn.call(ctx, result, array[i]);
  }
  return result;
};