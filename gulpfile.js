"use strict";

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const server = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const uglify = require("gulp-uglify");
const htmlmin = require("gulp-htmlmin");

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(gulp.dest("build/css"))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename({suffix: ".min"}))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/img/**/s-{icon,logo}-*.svg", gulp.series("sprite", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
  gulp.watch("source/js/**/*.js", gulp.series("js", "refresh"));

});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("images", function () {
  return gulp.src(["source/img/**/*.{png,jpg,svg}", "!source/img/**/s-{icon,logo}-*.svg"])
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
});

gulp.task("webp", function () {
  return gulp.src(["source/img/**/*.{png,jpg}", "!source/img/**/bg-*.{png,jpg}"])
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source/img"));
});

gulp.task("sprite", function () {
  return gulp.src("source/img/**/s-{icon,logo}-*.svg")
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          {removeAttrs: {attrs:["fill"]}}]
      })]))
    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "!source/img/**/s-{icon,logo}-*.svg"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("html", function () {
  return gulp.src([
    "source/*.html"
  ], {
    base: "source"
  })
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"))
});

gulp.task("copyNodeModules", function () {
  return gulp.src([
    "node_modules/picturefill/dist/picturefill.min.js",
    "node_modules/svg4everybody/dist/svg4everybody.min.js"
  ])
    .pipe(gulp.dest("build/js"))
});

gulp.task("js", function () {
  return gulp.src([
    "source/js/**/*.js"
  ], {
    base: "source"
  })
    .pipe(plumber())
    .pipe(gulp.dest("build"))
    .pipe(uglify())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("build", gulp.series("clean", "images", "webp", "copy", gulp.parallel("css", "sprite", "html", gulp.series("copyNodeModules", "js"))));
gulp.task("start", gulp.series("build", "server"));
