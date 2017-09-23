const gulp = require('gulp');
const browserSync = require('browser-sync');
const typescript = require('gulp-typescript');

const tsconfig = require('./tsconfig.json');

gulp.task('build-script', function () {
    return gulp.src(['src/**/*.ts'], { base: './' })
        .pipe(typescript(tsconfig.compilerOptions))
        .pipe(gulp.dest('build'));
});

gulp.task('build-html', function () {
    return gulp.src(['src/app/**/*.html', '!index.html'])
        .pipe(gulp.dest('build/src/app'));
});

gulp.task('build-css', function () {
    return gulp.src(['src/app/**.css'])
        .pipe(gulp.dest('build/src/app'));
});

gulp.task('build', ['build-script', 'build-html', 'build-css']);

gulp.task('start', ['build'], function () {

    browserSync.init({
        startPath: '',
        server: { baseDir: './' }
    });

    gulp.watch(['src/app/**/*.html', '!index.html'], ['build-html', browserSync.reload]);
    gulp.watch(['src/**/*.ts'], ['build', browserSync.reload]);
    gulp.watch(['src/app/**.css'], ['build-css', browserSync.reload]);
    gulp.watch(['tsconfig.json', 'gulpfile.js', 'index.html'], ['build', browserSync.reload]);

});

gulp.task('default', ['start']);
