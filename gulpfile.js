'use strict';

const gulp         = require('gulp');
const sass         = require('gulp-sass');
const sourcemaps   = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const sassGlob     = require('gulp-sass-glob');
const stylelint    = require('gulp-stylelint');
const uglify       = require('gulp-uglify');
const browserify   = require('browserify');
const watchify     = require('watchify');
const babel        = require('babelify');
const source       = require('vinyl-source-stream');
const buffer       = require('vinyl-buffer');
const del          = require('del');

//
// JS
//
function compileJS() {
    return _compileJS();
}

function cleanJS() {
    return del(['./dist/js']);
}

const moveJS = gulp.series(cleanJS, compileJS);

const watchJS = () => _compileJS(true);

exports.js = moveJS;

//
// CSS
//
function compileCSS() {
    return gulp.src('./assets/scss/theme.scss')
      .pipe(stylelint({
          reporters: [{formatter: 'string', console: true}]
      }))
      .pipe(sassGlob())
      .pipe(sass({
          includePaths: 'node_modules'
      }).on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./dist/css'));
}

function cleanCSS() {
    return del(['./dist/css']);
}

const moveCSS = gulp.series(cleanCSS, compileCSS);

function watchCSS() {
    gulp.watch('./assets/scss/**/*.scss', compileCSS);
}

exports.css = moveCSS;

//
// Fonts
//
function copyFonts() {
    return gulp.src('./assets/fonts/**/*').pipe(gulp.dest('./dist/fonts'));
}

function cleanFonts() {
    return del(['./dist/fonts']);
}

const moveFonts = gulp.series(cleanFonts, copyFonts);

function watchFonts() {
    gulp.watch('./assets/fonts/**/*', copyFonts)
}

exports.fonts = moveFonts;

//
// Images
//
function copyImages() {
    return gulp.src('./assets/img/**/*').pipe(gulp.dest('./dist/img'));;
}

function copyFavicon() {
    return gulp.src('./assets/favicon.ico').pipe(gulp.dest('./dist'));
}

function cleanImages() {
    return del(['./dist/img']);
}

const moveImages = gulp.series(cleanImages, gulp.parallel(copyImages, copyFavicon));

function watchImages() {
    gulp.watch('./assets/img/**/*', gulp.parallel(copyImages, copyFavicon));
}

exports.images = moveImages;

//
// Task sets
//

exports.watch = function() {
    watchCSS();
    watchJS();
    watchImages();
    watchFonts();
}

exports.default = gulp.parallel(moveFonts, moveCSS, moveJS, moveImages);

//
// Utils
//
function _compileJS(watch) {

    let bundler = browserify('./assets/js/mandelbrot.js', {
        debug: true,
    }).transform(babel, {
        presets: ['@babel/preset-env']
    });

    if (watch) {
        bundler = watchify(bundler);
        bundler.on('update', function () {
            console.log('Rebundling JS....');
            rebundle();
        });
    }

    function rebundle() {
        let bundle = bundler.bundle()
            .on('error', function (err) {
                console.error(err.message);
                // this.emit('end');
            })
            .pipe(source('mandelbrot.js'))
            .pipe(buffer());

        if (!watch) {
            bundle.pipe(uglify());
        }

        bundle.pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist/js'));

        return bundle;
    }

    return rebundle();
}
