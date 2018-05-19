var gulp = require('gulp');
var wiredep = require('wiredep').stream;

var urls = {
    source: './src/',
    index: './src/index.html'
}

gulp.task('bower', function () {
  gulp.src(urls.index)
    .pipe(wiredep({}))
    .pipe(gulp.dest(urls.source));
});

gulp.task('default', function(){});