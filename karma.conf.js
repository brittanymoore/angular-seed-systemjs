module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', 'browserify'],
        client: {
            builtPaths: ['dev/'],
            clearContext: false
        },
        files: [         
            'node_modules/systemjs/dist/system.src.js',

            'node_modules/core-js/client/shim.js',
            'node_modules/zone.js/dist/zone.js',
            'node_modules/zone.js/dist/long-stack-trace-zone.js',
            'node_modules/zone.js/dist/proxy.js',
            'node_modules/zone.js/dist/sync-test.js',
            'node_modules/zone.js/dist/jasmine-patch.js',
            'node_modules/zone.js/dist/async-test.js',
            'node_modules/zone.js/dist/fake-async-test.js'
            ,
            { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
            { pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },

            { pattern: 'node_modules/@angular/**/*.js', included: false, watched: false },
            { pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: false },

            { pattern: 'config/systemjs.config.js', included: false, watched: false },
            { pattern: 'config/systemjs-angular-loader.js', included: false, watched: false },

            'karma.test.shim.js',
            
            { pattern: 'dev/**/*.js', included: false, watched: true },        
            { pattern: 'dev/**/*.html', included: false, watched: true },            
            { pattern: 'dev/**/*.css', included: false, watched: true },
        ],
        preprocessors: {
            //'dev/**/*.js': ['browserify', 'sourcemap']
        },
        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-spec-reporter',
            'karma-browserify',
            'karma-sourcemap-loader'
        ],
        proxies: {
            '/base/dev/node_modules/': '/base/node_modules/'
        },
        reporters: ['spec'],
        specReporter: {
            failFast: true,
            suppressErrorSummary: true
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        concurrency: Infinity
    });
}