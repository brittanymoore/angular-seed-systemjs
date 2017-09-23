const gulp = require('gulp');
const browserSync = require('browser-sync');
const typescript = require('gulp-typescript');
const rename = require('gulp-rename');
const systemjsBuilder = require('systemjs-builder');
const inlineNg2Template = require('gulp-inline-ng2-template');
const ejs = require('gulp-ejs');
const del = require('del');
const runSequence = require('run-sequence');

const tsconfig = require('./tsconfig.json');

// source paths
const SOURCE_PATHS = {
    ts: ['src/**/*.ts'],
    html: ['src/app/**/*.html', '!index.html'],
    css: ['src/app/**/*.css']
};

/* dev build mode */

// dev paths
const DEV_OUTPUT_PATHS = {
    ts: 'dev',
    html: 'dev/src/app',
    css: 'dev/src/app'
};

gulp.task('dev-build-script', function () {
    return gulp.src(SOURCE_PATHS['ts'], { base: './' })
        .pipe(typescript(tsconfig.compilerOptions))
        .pipe(gulp.dest(DEV_OUTPUT_PATHS['ts']));
});

gulp.task('dev-build-html', function () {
    return gulp.src(SOURCE_PATHS['html'])
        .pipe(gulp.dest(DEV_OUTPUT_PATHS['html']));
});

gulp.task('dev-build-css', function () {
    return gulp.src(SOURCE_PATHS['css'])
        .pipe(gulp.dest(DEV_OUTPUT_PATHS['css']));
});

gulp.task('dev-copy-index', function () {
    return gulp.src('config/index-dev.template.ejs')
        .pipe(ejs({}))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(DEV_OUTPUT_PATHS['ts']));
});

gulp.task('dev-build', ['dev-build-script', 'dev-build-html', 'dev-build-css', 'dev-copy-index']);

gulp.task('dev-start', ['dev-build'], function () {

    browserSync.init({
        startPath: '',
        server: { baseDir: ['./', './dev'] }
    });

    gulp.watch(SOURCE_PATHS['ts'], ['dev-build', browserSync.reload]);
    gulp.watch(SOURCE_PATHS['html'], ['dev-build-html', browserSync.reload]);
    gulp.watch(SOURCE_PATHS['css'], ['dev-build-css', browserSync.reload]);

});

/* prod build mode */

// dev paths
const PROD_OUTPUT = 'dist';

gulp.task('prod-build-script', function () {
    return gulp.src(SOURCE_PATHS['ts'], { base: './' })
        .pipe(inlineNg2Template({
            useRelativePaths: true,
            supportNonExistentFiles: true
        }))
        .pipe(typescript(tsconfig.compilerOptions))
        .pipe(gulp.dest(PROD_OUTPUT));
});

gulp.task('prod-copy-index', function () {
    return gulp.src('config/index-prod.template.ejs')
        .pipe(ejs({}))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(PROD_OUTPUT));
});

gulp.task('prod-bundle', ['prod-copy-index', 'prod-build-script'], function () {
    const builder = new systemjsBuilder('', 'systemjs.config.prod.js');
    return builder.buildStatic('app', 'dist/app.bundle.min.js', {
            minify: true,
            mangle: true,
            rollup: true
        })
});

gulp.task('prod-postbuild', function () {
    return del(['dist/src/**']);
});

gulp.task('prod-build', function () {
    runSequence('prod-bundle', 'prod-postbuild');
});

gulp.task('prod-start', ['prod-build'], function () {
    
    browserSync.init({
        startPath: '',
        server: { baseDir: './dist' }
    });

});

// default task is dev start
gulp.task('default', ['dev-start']);
