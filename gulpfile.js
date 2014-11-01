var gulp = require('gulp')
  , stylus = require('gulp-stylus')
  , browserify = require('gulp-browserify')
  , nodemon = require('gulp-nodemon')

// Commands
gulp.task('default', ['build', 'watch', 'serve'])
gulp.task('build', ['scripts', 'styles'])

// Save paths for easy reference
var paths = {
  app: './bin/wwww'
, scripts: {
    watch: './assets/javascripts/*.js'
  , src: './assets/javascripts/script.js'
  , tar: './public/javascripts/'
  }
, styles: {
    watch: './assets/stylesheets/*.styl'
  , src: './assets/stylesheets/style.styl'
  , tar: './public/stylesheets/'
  }
}

// Watch everything
gulp.task('watch', function() {
  gulp.watch(paths.scripts.watch, ['scripts'])
  gulp.watch(paths.styles.watch, ['styles'])
})

// Run server and watch everything
gulp.task('serve', ['build'], function() {
  nodemon({ script: paths.app, ext: 'js html css', ignore: ['assets/*'] })
})

// JS build task
gulp.task('scripts', function() {
  gulp.src(paths.scripts.src)
    .pipe(browserify({}))
    .pipe(gulp.dest(paths.scripts.tar))
})

// CSS build task
gulp.task('styles', function() {
  return gulp.src(paths.styles.src)
    .pipe(stylus({
      compress: true
    }))
    .pipe(gulp.dest(paths.styles.tar))
})
