var gulp   = require('gulp'),
    sass   = require('gulp-sass'),
    babel  = require('gulp-babel'),
    concat = require('gulp-concat');

gulp.task('styles', function() {
    return gulp
            .src('src/Frontend/sass/app.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('web/assets/css'))
});

gulp.task('scripts', function () {
    return gulp
            .src('src/Frontend/**/*.js')
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(concat('app.js'))
            .pipe(gulp.dest('web/assets/js'))
});

gulp.task('default', function() {
    gulp.watch('src/Frontend/sass/**/*.scss', ['styles']);
    gulp.watch('src/Frontend/js/**/*.js', ['scripts']);
});