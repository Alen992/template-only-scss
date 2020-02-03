// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync').create();

// for html
const htmlmin = require('gulp-htmlmin');

// File paths
const files = {
  scssPath: 'src/scss/**/*.scss',
  htmlPath: 'src/*.html'
};

// Sass task: compiles the style.scss file into style.css
function scssTask() {
  return src(files.scssPath)
    .pipe(sourcemaps.init()) // initialize sourcemaps first
    .pipe(sass()) // compile SCSS to CSS
    .pipe(postcss([autoprefixer(), cssnano()])) // PostCSS plugins
    .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
    .pipe(dest('dist/css')) // put final CSS in dist folder
    .pipe(browserSync.stream());
}

//html task
function htmlTask() {
  return src(files.htmlPath)
    .pipe(
      htmlmin({
        collapseWhitespace: true
      })
    )
    .pipe(dest('./dist'));
}

// Watch task: watch SCSS and HTML files for changes
// If any change, run scss and html tasks simultaneously
function watchTask() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  watch([files.htmlPath, files.scssPath], parallel(htmlTask, scssTask));
  watch('./dist/index.html').on('change', browserSync.reload);
}

// Export the default Gulp task so it can be run
// Runs the scss and html tasks simultaneously
// then runs watch task
exports.default = series(parallel(htmlTask, scssTask), watchTask);
