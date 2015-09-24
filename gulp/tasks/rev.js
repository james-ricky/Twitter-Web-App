// 'use strict'
//
// var gulp = require('gulp');
// var buffer = require('gulp-buffer');
// var rev = require('gulp-rev');
//
// gulp.task('rev-scss', function () {
//   // by default, gulp would pick `assets/css` as the base,
//   // so we need to set it explicitly:
//   return gulp.src(['app/styles/main.scss'], {base: 'app'})
//       .pipe(gulp.dest('build'))  // copy original assets to build dir
//       .pipe(buffer())
//       .pipe(rev())
//       .pipe(gulp.dest('build'))  // write rev'd assets to build dir
//       .pipe(rev.manifest({
//         merge: true
//       }))
//       .pipe(gulp.dest('.')); // write manifest to build dir
// });
//
// gulp.task('rev-js', function () {
//   // by default, gulp would pick `assets/css` as the base,
//   // so we need to set it explicitly:
//   return gulp.src(['app/js/main.js'], {base: 'app'})
//       .pipe(gulp.dest('build'))  // copy original assets to build dir
//       .pipe(buffer())
//       .pipe(rev())
//       .pipe(gulp.dest('build'))  // write rev'd assets to build dir
//       .pipe(rev.manifest({
//         merge: true
//       }))
//       .pipe(gulp.dest('.')); // write manifest to build dir
// });
