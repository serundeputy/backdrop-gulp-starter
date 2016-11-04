/**
 * @file
 *  Gulp task definitions for the project.
 *
 */
/* eslint-env node */
'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var shell = require('gulp-shell');
var phpcs = require('gulp-phpcs');
var eslint = require('gulp-eslint');
var phplint = require('gulp-phplint');

// Load in configuration.  You don't have to use this,
// but it makes it easier to update tasks in the future
// if paths aren't scattered in the gulpfile.
var config = require('./gulpconfig');

/**
 * @task sass
 * Compile files from scss
 */
gulp.task('sass', function () {
  // This needs to be changed to point to the source styles.scss file for the project theme.
  return gulp.src('core/themes/bartik/scss/styles.scss')
  // pass the file through gulp-sass
  .pipe(sass())
  // pass the file through autoprefixer
  .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
  // output .css file to css folder
  .pipe(gulp.dest('core/themes/bartik/css'));
});

/**
 * @task clearcache
 * Clear all caches
 */
gulp.task('clearcache', shell.task([
  'drush cr'
]));

/**
 * @task watch
 * Watch scss files for changes & recompile
 * Clear cache when Drupal related files are changed
 */
gulp.task('watch', function () {
  browserSync.init({
    // This needs to be replaced with your local site's proxy
    proxy: 'flat/gulp-and-drupal'
  });
  var path = 'core/themes/bartik/';
  gulp.watch([path + 'scss/*.scss', path + 'scss/**/*.scss'], ['sass', 'clearcache', function (done) {
    // Comment out this line to prevent the whole browser from reloading
    browserSync.reload();
  }]);
  gulp.watch('**/*.{php,inc,info}', ['clearcache', function (done) {
    // Comment out this line to prevent the whole browser from reloading
    browserSync.reload();
  }]);
});

/**
 * Check tasks
 *
 * Add steps here to run during checking phase of the app.
 * Check steps should not require a database to function.
 */
gulp.task('check', ['check:phplint', 'check:phpcs', 'check:eslint']);
gulp.task('check:phplint', function () {
  return gulp.src(config.phpCheck)
    .pipe(phplint('', {notify: false, skipPassedFiles: true}))
    .pipe(phplint.reporter('fail'));
});
gulp.task('check:phpcs', function () {
  return gulp.src(config.phpCheck)
    .pipe(phpcs({
      bin: 'vendor/bin/phpcs',
      standard: 'vendor/drupal/coder/coder_sniffer/Drupal'
    }))
    .pipe(phpcs.reporter('log'))
    .pipe(phpcs.reporter('fail'));
});
gulp.task('check:eslint', function () {
  return gulp
    .src(config.jsCheck)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

/**
 * Default task, running just `gulp` will
 * compile Sass files, launch BrowserSync & watch files.
 */
gulp.task('default', ['sass', 'watch']);
