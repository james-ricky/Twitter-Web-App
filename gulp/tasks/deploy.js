'use strict';

var gulp = require('gulp');
var shell = require('shelljs');
var argv = require('yargs')
    .default('env', 'demo')
    .argv

gulp.task('deploy', function() {
  var today = new Date();
  var yyyy = today.getFullYear();
  var mm = today.getMonth() + 1; //January is 0!
  var dd = today.getDate();
  var hh = today.getHours();
  var MM = today.getMinutes();
  var ss = today.getSeconds();

  var gulpDeployTask = argv.env;

  var deployBranchName = 'deployed-' + gulpDeployTask + '-' + yyyy + mm + dd + hh + MM + ss;

  if (!shell.which('git')) {
      console.error('You need git installed to deploy.');
      shell.exit(1);
  }

  if (shell.exec('git checkout -b ' + deployBranchName).code !== 0) {
      console.error('Failed to add bower components directory to commit');
      shell.exit(1);
  }

  if (shell.exec('gulp ' + gulpDeployTask).code !== 0) {
      console.error('Failed to build prod files');
      shell.exit(1);
  }

  if (shell.exec('git add --force ./bower_components/**/*').code !== 0) {
      console.error('Failed to add bower components directory to commit');
      shell.exit(1);
  }

  if (shell.exec('git add --force ./build/* ./build/**/*').code !== 0) {
      console.error('Failed to add build directory to commit');
      shell.exit(1);
  }

  if (shell.exec('git commit -m "Add the build and bower_components folders"').code !== 0) {
      console.error('Committing changes failed');
      shell.exit(1);
  }

  if (shell.exec('git push --force ' + gulpDeployTask + ' ' + deployBranchName + ':master').code !== 0) {
      console.error('Pushing to heroku failed');
      shell.exit(1);
  }

  if (shell.exec('git push origin ' + deployBranchName).code !== 0) {
      console.error('Pushing to heroku failed');
      shell.exit(1);
  }

  if (shell.exec('git checkout master').code !== 0) {
      console.error('Switching back to master branch');
      shell.exit(1);
  }

  if (gulpDeployTask === 'demo') {
    if (shell.exec('heroku open').code !== 0) {
        console.error('Open heroku page');
        shell.exit(1);
    }
  }

  if (shell.exec('rm -rf ./bower_components').code !== 0) {
      console.error('Delete bower_components folder');
      shell.exit(1);
  }

  if (shell.exec('bower install').code !== 0) {
      console.error('bower install into bower_components');
      shell.exit(1);
  }
});
