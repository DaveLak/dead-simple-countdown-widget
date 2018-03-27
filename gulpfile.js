'use strict';
/* Node standard libs and other utilities */
var path = require('path');
var del = require('del');
var chalk = require('chalk');

/* Gulp and Gulp Utilities */
var gulp = require('gulp');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var changed = require('gulp-changed');
var zip = require('gulp-zip');

/* Asset modifiers */
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var uglifyJS = require('gulp-uglify');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

// True if $NODE_ENV is set to 'production'.
var isProd = (process.env.NODE_ENV === 'production');

// Name of the directory to write the production bundle to.
var RELEASE_DIR = './dead-simple-countdown-widget/';
// Output directory.
var OUT_DIR = isProd ? RELEASE_DIR : './';

var PATHS = {
	scripts: {
		src: [
			'./assets/**/js/*.js'
		],
		dest: OUT_DIR + 'built/assets'
	},
	styles: {
		src: [
			'./assets/**/css/*.css'
		],
		dest: OUT_DIR + 'built/assets'
	},
	images: {
		src: [
			'./assets/**/images/**/*.*(svg|png|jpg|jpeg|gif)'
		],
		dest: OUT_DIR + 'built/assets'
	},
	php: {
		src: './**/**/*.php',
		dest: OUT_DIR
	}
};

/*********************
 *       Tasks       *
 *********************/

// Remove built directories so we can start fresh.
gulp.task('clean', function () {
	return del([
		RELEASE_DIR,
		PATHS.scripts.dest,
		PATHS.styles.dest,
		PATHS.images.dest
	]);
});

gulp.task('scripts', function () {
	return gulp.src(PATHS.scripts.src)
		.pipe(changed(PATHS.scripts.dest))
		.pipe(gulp.dest(PATHS.scripts.dest))
		.pipe(gulpif(!isProd, sourcemaps.init()))
			.pipe(uglifyJS())
			.pipe(rename({suffix: '.min.'}))
		.pipe(gulpif(!isProd, sourcemaps.write()))
		.pipe(gulp.dest(PATHS.scripts.dest));
});

gulp.task('styles', function () {
	var plugins = [
		autoprefixer(),
		cssnano()
	];
	return gulp.src(PATHS.styles.src)
		.pipe(changed(PATHS.styles.dest))
		.pipe(gulp.dest(PATHS.styles.dest))
		.pipe(gulpif(!isProd, sourcemaps.init()))
			.pipe(postcss(plugins))
			.pipe(rename({suffix: '.min.'}))
		.pipe(gulpif(!isProd, sourcemaps.write()))
		.pipe(gulp.dest(PATHS.styles.dest));
});

gulp.task('images', function () {
	return gulp.src(PATHS.images.src)
		.pipe(changed(PATHS.images.dest))
		.pipe(gulpif(isProd, imagemin()))
		.pipe(gulp.dest(PATHS.images.dest));
});

gulp.task('php', function () {
	return gulp.src(PATHS.php.src)
		.pipe(changed(PATHS.php.dest))
		.pipe(gulp.dest(PATHS.php.dest));
});

gulp.task('assets', ['images', 'styles', 'scripts']);

// Bundle files for release and package into a zip.
gulp.task('bundle', ['assets', 'php'], function () {
	return gulp.src(RELEASE_DIR + '**/*')
		.pipe(zip('dead-simple-countdown-widget.zip'))
		.pipe(gulp.dest('./'));
});

gulp.task('watch', ['assets'], function () {
	var scriptWatcher = gulp.watch(PATHS.scripts.src, ['scripts']);
	var styleWatcher = gulp.watch(PATHS.styles.src, ['styles']);
	var imageWatcher = gulp.watch(PATHS.images.src, ['images']);

	scriptWatcher.on('change', function(event) {
		console.log(
			'File ' + chalk.blue.bold(path.basename(event.path)) +
			' was ' + styleEventText(event.type) + ', running task "scripts".'
		);
	});
	styleWatcher.on('change', function(event) {
		console.log(
			'File ' + chalk.blue.bold(path.basename(event.path)) +
			' was ' + styleEventText(event.type) + ', running task "styles".'
		);
	});
	imageWatcher.on('change', function(event) {
		console.log(
			'File ' + chalk.blue.bold(path.basename(event.path)) +
			' was ' + styleEventText(event.type) + ', running task "images".'
		);
	});
});

gulp.task('default', ['assets']);

/****************
 *    Utils     *
 ****************/
function styleEventText(eventType) {
	switch (eventType){
		case 'added':
			return chalk.green.underline(eventType);
		case 'changed':
			return chalk.yellow.underline(eventType);
		case 'deleted':
			return chalk.red.underline(eventType);
	}
}
