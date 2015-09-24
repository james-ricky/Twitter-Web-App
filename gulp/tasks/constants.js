'use strict';

var config = require('../config');
var gulp   = require('gulp');
var ngConstant = require('gulp-ng-constant');

gulp.task('constants', function () {
  var dest = config.scripts.dest;
  var myConfig = require('../../app/env.json');
  var envConfig = myConfig[global.deployTarget];

  return ngConstant({
      name: 'lamplight.env',
      templatePath: 'gulp/tpls/constant.tpl.ejs',
      constants: envConfig,
      stream: true
    })
    .pipe(gulp.dest(dest));
});
