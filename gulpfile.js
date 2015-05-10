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
var gzip = require('gulp-gzip');

var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// spread es6 args
// ---------------
// "macro expansion" neither recursive nor hygiene!
// 
var re = /(function[^(]*\()([^)]*?),?\s*\.\.\.([$_a-zA-Z][$_\w]*)([^)]*\)[^{]*\{)/g;
var cb = function(_, open, args, accum, close){
  var offset = args.trim() ? args.split(',').length : 0;

  return util.format(open + args + close +
    'var __args = arguments,' +
        '__i = __args.length,' +
        '__offset = %d,' +
        '__hasArgs = __i > __offset,' +
        '%s = new Array(__hasArgs ? __i-__offset : 0);' +
    'for (__hasArgs && (%s[0] = %s); __offset < __i--;) %s[__i-__offset] = __args[__i];',
    offset, accum, accum, accum, accum
  );
};

gulp.task('spread', function () {
  gulp.src('./src/f.js')
      .pipe(replace(re, cb))
      .pipe(rename('f.spread.js'))
      .pipe(gulp.dest('./build/'));
});

gulp.task('build-compat', ['spread'], function () {
  gulp.src('./build/f.spread.js')
      .pipe(uglify({
        mangle: false,
        preserveComments: 'all',
        output: { beautify: true, max_line_len: 120 },
        compress: { global_defs: { __COMPAT__: true, __VERSION__: pkg.version }}
      }))
      .pipe(rename(util.format('f.compat-%s.js', pkg.version)))
      .pipe(gulp.dest('./build/'))

      .pipe(uglify({ compress: { global_defs: { __COMPAT__: true, __VERSION__: pkg.version }}}))
      .pipe(rename(util.format('f.compat.min-%s.js', pkg.version)))
      .pipe(gulp.dest('./build/'))

      .pipe(gzip())
      .pipe(gulp.dest('./build/'));
});

gulp.task('build', ['spread'], function () {
    gulp.src('./build/f.spread.js')
        .pipe(uglify({
          mangle: false,
          preserveComments: 'all',
          output: { beautify: true, max_line_len: 120 },
          compress: { global_defs: { __COMPAT__: false, __VERSION__: pkg.version }}
        }))
        .pipe(rename(util.format('f-%s.js', pkg.version)))
        .pipe(gulp.dest('./build/'))

        .pipe(uglify({ compress: { global_defs: { __COMPAT__: false, __VERSION__: pkg.version }}}))
        .pipe(rename(util.format('f.min-%s.js', pkg.version)))
        .pipe(gulp.dest('./build/'))

        .pipe(gzip())
        .pipe(gulp.dest('./build/'));
});

gulp.task('browserify', ['build-compat'], function (){
  gulp.src('./test/f.test.js')
      .pipe(browserify({ insertGlobals : true }))
      .pipe(rename('f.test.browserified.js'))
      .pipe(gulp.dest('./test/'));
});

gulp.task('jshint', ['spread'], function() {
  gulp.src(['./build/f.spread.js', './test/f.test.js', './gulpfile.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('default', ['jshint', 'browserify', 'build-compat', 'build']);
