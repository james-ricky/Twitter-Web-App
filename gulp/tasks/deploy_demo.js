'use strict';

var gulp        = require('gulp');
var runSequence = require('run-sequence');

gulp.task('demo', ['clean'], function(cb) {

  cb = cb || function() {};

  global.isProd = true;
  global.deployTarget = 'demo';

  runSequence('styles', 'images', 'fonts', 'views', 'constants', 'browserify', cb);

});
