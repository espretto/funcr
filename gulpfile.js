'use strict';

var exec = require('child_process').exec;
var util = require('util');

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var replace = require('gulp-replace');
var browserify = require('gulp-browserify');

// spread es6 args
var re = /(function[^(]*\()([^)]*?),?\s*\.\.\.([_$a-zA-Z][$_\w]*)(\s*\)\s*\{)/g;
var cb = function(match, preamble, args, accum, closing){
  var offset = args.trim() ? args.split(',').length : 0;
  return util.format('%s%s%sfor (var ' + 
    '__args = arguments,' +
    '__i = __args.length, ' + 
    '__j = %d, ' +
    '%s = new Array(__j < __i ? __i - __j : 0);' +
    '__j < __i--;) ' +
    '%s[__i-__j] = __args[__i];',
    preamble, args, closing, offset, accum, accum
  );
}

gulp.task('default', function(){
  return gulp.src('./src/f.js')
    .pipe(replace(re, cb))
    .pipe(gulp.dest('./build/expanded/'))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/minified/'))
});

gulp.task('test', function (){
  return gulp.src('./test/f.test.js')
    .pipe(browserify({
      insertGlobals : true,
      debug : !gulp.env.production
    }))
    .pipe(gulp.dest('./test/browserified'))
});

gulp.task('gzip', ['build'], function(cb){
  
  exec('gzip -c9 ./build/minified/f.js > build/f.min.js.gz', function (err){
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
