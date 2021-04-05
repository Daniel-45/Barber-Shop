const { src, dest, watch, parallel } = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss')
const sourcemaps = require('gulp-sourcemaps')
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const cache = require('gulp-cache');
const webp = require('gulp-webp');

const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    imagenes: 'src/images/**/*'
}

function css() {
    return src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./build/css'));
}

function javascript() {
    return src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('./build/js'))
}

function imagenes() {
    return src(paths.imagenes)
        .pipe(cache(imagemin({ optimizationLevel: 3 })))
        .pipe(dest('build/images'))
        .pipe(notify({ message: 'Imagen completada' }));
}

function formatoWebp() {
    return src(paths.imagenes)
        .pipe(webp())
        .pipe(dest('build/images'))
        .pipe(notify({ message: 'Imagen completada' }));
}

function watchSass() {
    watch(paths.scss, css);
}

exports.css = css;
exports.javascript = javascript;
exports.imagenes = imagenes;
exports.formatoWebp = formatoWebp;
exports.watchSass = watchSass;
exports.default = parallel(css, watchSass); 