'use strict';

module.exports = {

  'serverport': 3000,

  'stylesWatch': {
    'src' : 'app/styles/**/*.scss',
    'dest': 'build/css'
  },

  'styles': {
    'src' : 'app/styles/main.scss',
    'dest': 'build/css'
  },

  'scripts': {
    'src' : 'app/js/**/*.js',
    'dest': 'build/js'
  },

  'images': {
    'src' : 'app/images/**/*',
    'dest': 'build/images'
  },

  'fonts': {
    'src' : ['bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*', 'bower_components/font-awesome/fonts/*', 'app/fonts/*'],
    'dest': 'build/fonts'
  },

  'views': {
    'watch': [
      'app/index.html',
      'app/views/**/*.html'
    ],
    'src': 'app/views/**/*.html',
    'dest': 'app/js'
  },

  'dist': {
    'root'  : 'build'
  },

  'browserify': {
    'entries'   : ['./app/js/main.js'],
    'bundleName': 'main.js',
    'sourcemap' : true
  },

  'test': {
    'karma': 'test/karma.conf.js',
    'protractor': 'test/protractor.conf.js'
  }

};
