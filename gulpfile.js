var gulp    = require('gulp'),
browserSync = require('browser-sync'),
cache       = require('gulp-cached'),
clean       = require('gulp-clean'),
progeny     = require('gulp-progeny'),
imageMin    = require('gulp-imagemin'),
useref      = require('gulp-useref'),
gulpif      = require('gulp-if'),
uglify      = require('gulp-uglify'),
compass     = require('gulp-compass'),
minifyCss   = require('gulp-minify-css'),
bower       = require('gulp-bower');

//Bower
gulp.task('bower', function() {
  return bower({ directory: './bower_components' })
    .pipe(gulp.dest('app/libs'))
});

/*CLEAR*/
gulp.task('clean', function(){
	return gulp.src('dist/', {read: false})
	.pipe(clean())
})

/*Сборка в определенном порядке*/
gulp.task('build', ['clean', 'compass', 'css', 'images', 'fonts'], function(){
	return gulp.src('app/**/*.html')
	.pipe(gulpif('*.js', uglify()))
	.pipe(gulpif('*.css', minifyCss()))
	.pipe(useref())
	.pipe(gulp.dest('dist'));
})
/*COMPASS*/
gulp.task('compass', function () {
  return gulp.src('app/sass/**/*.+(sass|scss)') // получаем источники с помощью gulp.src
  .pipe(cache('compass'))
  .pipe(progeny())
  .pipe(compass({
	config_file: './config.rb',
	css: './app/css',
	sass: './app/sass',
  }))
  .on('error', function(error){
  	console.log(error)
  })
	.pipe(gulp.dest('app/css/')) // выходные файлы в папке destination
	.pipe(browserSync.reload({stream:true}))
});

gulp.task('css', function(){

	return gulp.src('app/css/**/*.css')
	.pipe(gulp.dest('dist/css/'))
})

/*IMAGES*/
gulp.task('images', function(){
	gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
	.pipe(imageMin({interlaced:true}))
	.pipe(gulp.dest('dist/images/'))
});
/*FONTS*/
gulp.task('fonts', function(){
	return gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts/'))
});
/*browserSync*/
gulp.task('browserSync', function(){
	browserSync({
		server:{baseDir:'app/'}
	})

});

/*Watcher*/
gulp.task('watch', ['browserSync'], function(){
	gulp.watch('app/sass/**/*.+(sass|scss)', ['compass']);		
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/css/**/*.css', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

