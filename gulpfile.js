'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var del = require('del');
var runSequence = require('run-sequence');

var dependenciesCss = [
    'bower_components/bootstrap/dist/css/bootstrap.css',
    'bower_components/font-awesome//css/font-awesome.css'
];

var dependenciesJs = [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/bootstrap/dist/js/bootstrap.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js'
];

var paths = {
    fonts: [
        'bower_components/bootstrap/dist/fonts/*',
        'bower_components/font-awesome/fonts/*'
    ],

    index: 'client/index.html',
    templates: ['!client/index.html', 'client/**/*.html'],
    scripts: ['!client/bower_components/**/*', 'client/**/*.module.js', 'client/**/*.js'],
    lessMain: 'client/admin.less',
    less: 'client/**/*.less',

    tmp: '.tmp',
    tmpJs: '.tmp/js',
    tmpCss: '.tmp/css',
    dist: 'dist',
    distJs: 'dist/js',
    distCss: 'dist/css',
    distFonts: 'dist/fonts'
};

gulp.task('clean', function(done) {
    return del([paths.tmp, paths.dist], function() {
        done();
    });
});

gulp.task('lint', function() {
    return gulp.src(paths.scripts)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('fonts', function() {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest(paths.distFonts));
});

/******************************************************************************
 * DEVELOPMENT
 *****************************************************************************/

gulp.task('copyJs', function() {
    return gulp.src(dependenciesJs)
        .pipe(plugins.concat('vendor.js'))
        .pipe(gulp.dest(paths.distJs));
});

gulp.task('copyCss', function() {
    return gulp.src(dependenciesCss)
        .pipe(plugins.concat('vendor.css'))
        .pipe(gulp.dest(paths.distCss));
});

/**
 * Inject development dependencies to index file and copy to dist folder
 */
 gulp.task('index', ['copyJs', 'copyCss', 'scripts', 'templates'], function() {
     var depStream = gulp.src([
       'dist/js/vendor.js',
       'dist/css/vendor.css',
       'dist/**/*',
     ]);
     return gulp.src(paths.index)
         .pipe(plugins.inject(depStream, {addRootSlash: false, ignorePath: 'dist',}))
         .pipe(gulp.dest(paths.dist));
 });

gulp.task('templates', function() {
    return gulp.src(paths.templates)
        .pipe(plugins.minifyHtml({empty: true}))
        .pipe(plugins.angularTemplatecache({module: 'admin'}))
        .pipe(gulp.dest(paths.distJs));
});

gulp.task('less', function() {
    return gulp.src(paths.lessMain)
        .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.less())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(paths.distCss));
});

gulp.task('scripts', ['lint'], function() {
    return gulp.src(paths.scripts)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.concat('admin.js'))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(paths.distJs));
});

gulp.task('dev', function(done) {
    runSequence(
        'clean',
        ['fonts', 'copyJs', 'copyCss', 'index', 'templates', 'less'],
        done
    );
});

gulp.task('watch', ['dev'], function() {
    gulp.watch(paths.index, ['index']);
    plugins.watch(paths.templates, function() {
        gulp.start('templates');
    });
    plugins.watch(paths.less, function() {
        gulp.start('less');
    });
    plugins.watch(paths.scripts, function() {
        gulp.start('scripts');
    });
});

/******************************************************************************
 * PRODUCTION
 *****************************************************************************/

 gulp.task('copyJs:build', function() {
     return gulp.src(dependenciesJs)
         .pipe(plugins.concat('vendor.js'))
         .pipe(gulp.dest(paths.tmpJs));
 });

 gulp.task('copyCss:build', function() {
     return gulp.src(dependenciesCss)
         .pipe(plugins.concat('vendor.css'))
         .pipe(gulp.dest(paths.tmpCss));
 });

gulp.task('templates:build', function() {
    return gulp.src(paths.templates)
        .pipe(plugins.minifyHtml({empty: true}))
        .pipe(plugins.angularTemplatecache({module: 'admin'}))
        .pipe(gulp.dest(paths.tmpJs));
});

gulp.task('less:build', function() {
    return gulp.src(paths.lessMain)
        .pipe(plugins.plumber())
        .pipe(plugins.less())
        .pipe(gulp.dest(paths.tmpCss));
});

gulp.task('scripts:build', function() {
    return gulp.src(paths.scripts)
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.concat('admin.js'))
        .pipe(gulp.dest(paths.tmpJs));
});

gulp.task('build:app', ['copyJs:build', 'copyCss:build', 'scripts:build', 'templates:build', 'less:build'], function(done) {
    var depStream = gulp.src([
      '.tmp/js/vendor.js',
      '.tmp/css/vendor.css',
      '.tmp/**/*'
    ]);
    gulp.src(paths.index)
        .pipe(plugins.inject(depStream, {addPrefix: '../'}))
        .pipe(plugins.usemin({
            html: [plugins.minifyHtml({empty: true})],
            css: ['concat', plugins.minifyCss(), plugins.rev()],
            js: ['concat', plugins.uglify(), plugins.rev()]
        }))
        .pipe(gulp.dest(paths.dist))
        .pipe(plugins.gzip())
        .pipe(gulp.dest(paths.dist))
        .on('end', function() {
            done();
        });
});

gulp.task('build', function(done) {
    runSequence(
        'clean',
        ['lint', 'fonts'],
        ['build:app'],
        done
    );
});

gulp.task('default', ['watch']);
