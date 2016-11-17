var gulp      = require('gulp'),
    sass      = require('gulp-sass'),
    babel     = require('gulp-babel'),
    concat    = require('gulp-concat'),
    uglify    = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    rename    = require('gulp-rename');

gulp.task('styles', function () {
    return gulp
        .src('src/Frontend/sass/app.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('web/assets/css'))
});

gulp.task('uglify-styles', function () {
    return gulp
        .src('web/assets/css/app.css')
        .pipe(uglifycss())
        .pipe(rename('app.min.css'))
        .pipe(gulp.dest('web/assets/css'))
});

gulp.task('scripts', function () {
    return gulp
        .src('src/Frontend/**/*.js')
        .pipe(concat('app.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('web/assets/js'))
});

gulp.task('uglify-scripts', function () {
    return gulp
        .src('web/assets/js/app.js')
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('web/assets/js'))
});

gulp.task('default', function () {
    gulp.watch('src/Frontend/sass/**/*.scss', ['styles', 'uglify-styles']);
    gulp.watch('src/Frontend/js/**/*.js', ['scripts', 'uglify-scripts']);
});