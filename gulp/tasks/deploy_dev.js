'use strict';

var gulp        = require('gulp');
var runSequence = require('run-sequence');

gulp.task('dev', ['clean'], function(cb) {

  cb = cb || function() {};

  global.isProd = false;
  global.deployTarget = 'development';

  runSequence('styles', 'images', 'fonts', 'views', 'constants', 'browserify', 'watch', cb);

});
