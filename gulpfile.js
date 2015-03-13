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
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');

var env = process.env.NODE_ENV || 'development';
var outputDir, sassStyle;

if (env === 'development') {
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
}

var coffeeSource = ['components/coffee/*.coffee'];
var jsSource = ['components/scripts/*.js'];
var sassSource = ['components/sass/style.scss'];
var htmlSource = [outputDir + '*.html'];

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
        .pipe(gulpif(env === 'production', uglify()))
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload());
});

gulp.task('compass', function () {
    gulp.src(sassSource)
        .pipe(compass({
            sass: 'components/sass',
            image: outputDir + 'images'
        }))
            .on('error', gutil.log)
        .pipe(gulpif(env === 'production', minifyCss()))
        .pipe(gulp.dest(outputDir + 'css'))
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(coffeeSource, ['coffee']);
    gulp.watch(jsSource, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch('builds/development/*.html', ['html']);
    gulp.watch(outputDir + 'js/*.json', ['json']);
});

gulp.task('connect', function () {
    connect.server({
        root: outputDir,
        livereload: true
    });
});

gulp.task('html', function () {
    gulp.src('builds/development/*.html')
        .pipe(gulpif(env === 'production', minifyHtml()))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
        .pipe(connect.reload());
});

gulp.task('json', function () {
    gulp.src(outputDir + 'js/*.json')
        .pipe(connect.reload());
});

// will be run by gulp command without params
gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);