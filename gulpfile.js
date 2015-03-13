/**
 *
 * @author Yevgen Kruglyk
 */
var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var compass = require('gulp-compass');
var connect = require('gulp-connect');

var coffeeSource = ['components/coffee/*.coffee'];
var jsSource = ['components/scripts/*.js'];
var sassSource = ['components/sass/style.scss'];

gulp.task('coffee', function () {
    gulp.src(coffeeSource)
        .pipe(coffee({ bare: true }))
            .on('error', gutil.log)
        .pipe(gulp.dest('components/scripts'));
});

gulp.task('js', function () {
    gulp.src(jsSource)
        .pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(gulp.dest('builds/development/js'))
        .pipe(connect.reload());
});

gulp.task('compass', function () {
    gulp.src(sassSource)
        .pipe(compass({
            sass: 'components/sass',
            image: 'builds/development/images',
            style: 'expanded'
        }))
            .on('error', gutil.log)
        .pipe(gulp.dest('builds/development/css'))
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(coffeeSource, ['coffee']);
    gulp.watch(jsSource, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
});

gulp.task('connect', function () {
    connect.server({
        root: 'builds/development/',
        livereload: true
    });
});

// will be run by gulp command without params
gulp.task('default', ['coffee', 'js', 'compass', 'connect', 'watch']);