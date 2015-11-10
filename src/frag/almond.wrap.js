
(function /*webpackUniversalModuleDefinition*/(root, factory) {
  if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if(typeof define === 'function' && define.amd)
    define([], factory);
  else if(typeof exports === 'object')
    exports["funcr"] = factory();
  else
    root["funcr"] = factory();
}(this, function() {
