var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var path = require("path");
var sourcemaps = require('gulp-sourcemaps');
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var tsify = require("tsify")

gulp.task("browserify", function () {
  return browserify({
      basedir: '.',
      debug: false,
      standalone: 'planB',
      entries: ['src/index.ts'],
      cache: {},
      packageCache: {},
  })
  .plugin(tsify)
  .bundle()
  .pipe(source('plan-b.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest("dist"));
});

gulp.task("minify", function(){
  return gulp
    .src(path.join("dist", "plan-b.js"))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min", prefix : "" }))
    .pipe(gulp.dest("."));
});

gulp.task("default", gulp.series("browserify","minify"));