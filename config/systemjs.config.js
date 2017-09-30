(function (global) {
    System.config({
        defaultExtension: 'js',
        paths: {
            'npm:': 'node_modules/'
        },
        map: {
            app: 'dist',
            'dev': 'dev',
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            'core-js': 'npm:core-js',
            'zone.js': 'npm:zone.js',
            'rxjs': 'npm:rxjs'
        },
        packages: {
            app: { main: './src/main-aot.js', defaultExtension: 'js' },
            dev: { main: 'src/main.js', defaultExtension: 'js', meta: { './*.js': { loader: 'config/systemjs-angular-loader.js' }}},
            rxjs: { defaultExtension: 'js' },
            'core-js': {},
            'zone.js': {}
        }
    });
})(this);
