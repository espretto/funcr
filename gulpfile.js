'use strict';

var exec = require('child_process').exec;
var util = require('util');

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');

// spread es6 args - "macro expansion" neither recursive nor hygiene!
var re = /(function[^(]*\()([^)]*?),?\s*\.\.\.([$_a-zA-Z][$_\w]*)(\s*\)\s*\{)/g;
var cb = function(_, open, args, accum, close){
  var offset = args.trim() ? args.split(',').length : 0;
  return util.format('%s%s%s' +
    'for (var __args = arguments, __i = __args.length, __j = %d, %s = new Array(__i > __j ? __i - __j : 0); __j < __i--;) ' +
    '%s[__i-__j] = __args[__i];',
    open, args, close, offset, accum, accum
  );
} 

gulp.task('default', function(){
  return gulp.src('./src/f.js')
    .pipe(replace(re, cb))
    .pipe(gulp.dest('./build/'))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .pipe(uglify())
    .pipe(rename('f.min.js'))
    .pipe(gulp.dest('./build/'))
});

gulp.task('test', function (){
  return gulp.src('./test/f.test.js')
    .pipe(browserify({
      insertGlobals : true
    }))
    .pipe(rename('f.test.browserified.js'))
    .pipe(gulp.dest('./test/'))
});

gulp.task('gzip', ['default'], function(cb){
  
  exec('gzip -c9 ./build/f.min.js > build/f.min.js.gz', function (err){
    if (err) cb(err);
    else cb();
  });

});

gulp.task('jshint', ['spread'], function() {
  gulp.src(['./src/f.js', './test/f.test.js', './gulpfile.js'])
      .replace(re, cb)
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
});
