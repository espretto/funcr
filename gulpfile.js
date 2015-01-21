'use strict';

var exec = require('child_process').exec;
var util = require('util');
var fs = require('fs');

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');

var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// spread es6 args
// ---------------
// "macro expansion" neither recursive nor hygiene!
// 
var re = /(function[^(]*\()([^)]*?),?\s*\.\.\.([$_a-zA-Z][$_\w]*)(\s*\)\s*\{)/g;
var cb = function(_, open, args, accum, close){
  var offset = args.trim() ? args.split(',').length : 0;

  return util.format(open + args + close +
    'for (var __args = arguments,' +
    '__i = __args.length,' +
    '__j = %d,' +
    '%s = new Array(__i > __j ? __i - __j : 0);' +
    '__j < __i--;' +
    ') %s[__i-__j] = __args[__i];',
    offset, accum, accum
  );
};

gulp.task('spread', function(){
  gulp.src('./src/f.js')
      .pipe(replace(re, cb))
      .pipe(gulp.dest('./build/'));
});

gulp.task('uglify', function(){
  gulp.src('./build/f.js')
      .pipe(uglify({ compress: { global_defs: { COMPAT: false }}}))
      .pipe(rename(util.format('f.min-%s.js', pkg.version)))
      .pipe(gulp.dest('./build/'));
});

gulp.task('compat', function(){
  gulp.src('./build/f.js')
      .pipe(uglify({
        mangle: false,
        preserveComments: 'all',
        output: { beautify: true },
        compress: { global_defs: { COMPAT: true }}
      }))
      .pipe(rename(util.format('f.compat-%s.js', pkg.version)))
      .pipe(gulp.dest('./build/'));
});

gulp.task('browserify', function (){
  gulp.src('./test/f.test.js')
      .pipe(browserify({ insertGlobals : true }))
      .pipe(rename(util.format('f.test.browserified-%s.js', pkg.version)))
      .pipe(gulp.dest('./test/'));
});

gulp.task('gzip', ['default'], function(cb){
  exec(util.format('gzip -c9 ./build/f.min-%s.js > build/f.min-%s.js.gz', pkg.version), function (err) {
    if (err) cb(err);
    else cb();
  });
});

gulp.task('jshint', ['spread'], function() {
  gulp.src(['./build/f.js', './test/f.test.js', './gulpfile.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('default', ['spread', 'jshint', 'compat', 'uglify', 'browserify', 'gzip']);
