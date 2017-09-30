const gulp = require('gulp');
const browserSync = require('browser-sync');
const typescript = require('gulp-typescript');
const rename = require('gulp-rename');
const systemjsBuilder = require('systemjs-builder');
const inlineNg2Template = require('gulp-inline-ng2-template');
const ejs = require('gulp-ejs');
const del = require('del');
const runSequence = require('run-sequence');
const ngc = require('gulp-ngc');
const server = require('karma').Server;

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
    root: 'dev',
    ts: 'dev/src',
    html: 'dev/src/app',
    css: 'dev/src/app'
};

gulp.task('dev-build-script', function () {

    const tsProject = typescript.createProject('tsconfig.json', { noResolve: true });

    return tsProject.src()
        .pipe(typescript(tsconfig.compilerOptions))
        .pipe(gulp.dest(DEV_OUTPUT_PATHS['ts']));
});

gulp.task('dev-build-html', function () {
    return gulp.src(SOURCE_PATHS['html'], { base: '.' })
        .pipe(gulp.dest(DEV_OUTPUT_PATHS['root']));
});

gulp.task('dev-build-css', function () {
    return gulp.src(SOURCE_PATHS['css'], { base: '.' })
        .pipe(gulp.dest(DEV_OUTPUT_PATHS['root']));
});

gulp.task('dev-copy-index', function () {
    return gulp.src('config/index-dev.template.ejs')
        .pipe(ejs({}))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(DEV_OUTPUT_PATHS['root']));
});

gulp.task('dev-build', ['dev-build-script', 'dev-build-html', 'dev-build-css', 'dev-copy-index']);

gulp.task('dev-watch', function () {
    gulp.watch(SOURCE_PATHS['ts'], ['dev-build', browserSync.reload]);
    gulp.watch(SOURCE_PATHS['html'], ['dev-build-html', browserSync.reload]);
    gulp.watch(SOURCE_PATHS['css'], ['dev-build-css', browserSync.reload]);
});

gulp.task('dev-start', ['dev-build', 'dev-watch'], function () {

    browserSync.init({
        startPath: '',
        server: { baseDir: ['./', './dev'] }
    });

});

/* test */

gulp.task('test', ['dev-build', 'dev-watch' ], function (done) {
    return new server({
        configFile: __dirname + '/karma.conf.js',
    }, done).start();
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
        .pipe(ngc('tsconfig-aot.json'));
});

gulp.task('prod-copy-index', function () {
    return gulp.src('config/index-prod.template.ejs')
        .pipe(ejs({}))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(PROD_OUTPUT));
});

gulp.task('prod-bundle', ['prod-copy-index', 'prod-build-script'], function () {
    const builder = new systemjsBuilder('', 'config/systemjs.config.js');
    return builder.buildStatic('app', 'dist/app.bundle.min.js', {
        minify: true,
        mangle: true,
        rollup: true
    });
});

gulp.task('prod-postbuild', function () {
    return del(['dist/src', 'dist/aot', 'aot']);
});

gulp.task('prod-build', function () {
    return runSequence('prod-bundle', 'prod-postbuild');
});

gulp.task('prod-start', ['prod-build'], function () {
    return browserSync.init({
        startPath: '',
        server: { baseDir: './dist' }
    });
});

// default task is dev start
gulp.task('default', ['dev-start']);
