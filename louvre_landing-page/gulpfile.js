const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const scss = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');

// Compile Server
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 3000,
            baseDir: "build"
        }
    });

    gulp.watch("build/**/*").on("change", browserSync.reload);
});

//Compile HTML
gulp.task("templates:compile", function(){
    return gulp.src("source/templates/index.pug")
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'));
});

// Compile CSS scss
gulp.task("styles:compile", function() {
    return gulp.src('source/styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(scss({outputStyle: 'compressed'}).on('error', scss.logError))
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('build/css'));
});

// Compile Sprites
gulp.task('sprite', function(cb) {
    const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../images/sprite.png',
        cssName: 'sprite.scss'
    }));

    spriteData.img.pipe(gulp.dest('build/images/'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cb();
});
  

// Compile delete files
gulp.task('clean', function del(cb) {
    return rimraf('build', cb);
});

// Compile Copy Fonts
gulp.task('copy:fonts', function() {
    return gulp.src('./source/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts/'));
});

// Compile Copy Images
gulp.task('copy:images', function() {
    return gulp.src('./source/images/**/*.*')
        .pipe(gulp.dest('build/images'));
});

// Compile Copy Fonts and Images
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

// Watchers
gulp.task('watch', function() {
    gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
});

// Default Task
gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
));