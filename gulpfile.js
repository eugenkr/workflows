/**
 *
 * @author Yevgen Kruglyk
 */
var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');

var coffeeSource = ['components/coffee/*.coffee'];
var jsSource = ['components/scripts/*.js'];

gulp.task('coffee', function () {
    gulp.src(coffeeSource)
        .pipe(coffee({ bare: true }))
            .on('error', gutil.log)
        .pipe(gulp.dest('components/scripts'));
});

gulp.task('js', function () {
    gulp.src(jsSource)
        .pipe(concat('script.js'))
        .pipe(gulp.dest('builds/development/js'));
});