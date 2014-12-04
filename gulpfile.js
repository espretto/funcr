'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');

var pkg = require('./package.json');

gulp.task('minify', function(){

  gulp.src('./src/f.js')
      .pipe(uglify())
      .pipe(gulp.dest('./dist/'));
});
