'use strict';

var gulp        = require('gulp');
var runSequence = require('run-sequence');

gulp.task('staging', ['clean'], function(cb) {

  cb = cb || function() {};

  global.isProd = true;
  global.deployTarget = 'staging';

  runSequence('styles', 'images', 'fonts', 'views', 'constants', 'browserify', cb);

});
