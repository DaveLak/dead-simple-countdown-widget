'use strict';
/*eslint  space-in-parens: 0, array-bracket-spacing: 0, yoda: 0 */

/* Node standard libs and other utilities */
var path = require('path');
var del = require('del');
var chalk = require('chalk');
var argv = require('yargs').argv;

/* Gulp and Gulp Utilities */
var gulp = require('gulp');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var changed = require('gulp-changed');
var zip = require('gulp-zip');

/*Linting tools*/
var stylelint = require('gulp-stylelint');
var eslint = require('gulp-eslint');

/* Asset modifiers */
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var iife = require('gulp-iife');
var babel = require('gulp-babel');
var uglifyJS = require('gulp-uglify');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

/* Environment dependent booleans */
var isDevelopment = ((true !== argv.production) || (true !== argv.p));
var isRelease = (true === argv.release);

/* Other vars */
// Name of the plugin, used in file and directory names.
var PLUGIN_NAME = 'dead-simple-countdown-widget';

// Name of the directory to write the release files and bundle to.
var RELEASE_DIR = './release';

// Directory where files get written to.
var OUT_DIR = isRelease ? RELEASE_DIR + '/' + PLUGIN_NAME + '/' : './';

// Read/Write paths of files.
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
gulp.task('clean', function() {
	return del([
		RELEASE_DIR,
		PATHS.scripts.dest,
		PATHS.styles.dest,
		PATHS.images.dest
	]);
});

gulp.task('scripts', ['lint-scripts'], function() {
	return gulp.src(PATHS.scripts.src)
		.pipe(changed(PATHS.scripts.dest))
		.pipe(gulp.dest(PATHS.scripts.dest))
		.pipe(sourcemaps.init())
		.pipe(babel({presets: ['env']}))
		.pipe(iife({
			useStrict: false,
			prependSemicolon: false
		}))
		.pipe(uglifyJS())
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write({addComment: isDevelopment}))
		.pipe(gulp.dest(PATHS.scripts.dest));
});

gulp.task('styles', ['lint-css'], function() {
	var plugins = [
		autoprefixer(),
		cssnano({zindex: false})
	];
	return gulp.src(PATHS.styles.src)
		.pipe(changed(PATHS.styles.dest))
		.pipe(gulp.dest(PATHS.styles.dest))
		.pipe(sourcemaps.init())
		.pipe(postcss(plugins))
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write({addComment: isDevelopment}))
		.pipe(gulp.dest(PATHS.styles.dest));
});

gulp.task('images', function() {
	return gulp.src(PATHS.images.src)
		.pipe(changed(PATHS.images.dest))
		.pipe(gulpif((false === isDevelopment), imagemin()))
		.pipe(gulp.dest(PATHS.images.dest));
});

gulp.task('php', function() {
	return gulp.src(PATHS.php.src)
		.pipe(changed(PATHS.php.dest))
		.pipe(gulp.dest(PATHS.php.dest));
});

/*********************
 *  Watch
 * *******************/
gulp.task('watch', ['assets'], function() {
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

/************************
 *    Linting
 *************************/
gulp.task('lint', ['lint-scripts', 'lint-css']);

gulp.task('lint-scripts', function() {
	return gulp.src(PATHS.scripts.src.concat(['!node_modules/**']))
		.pipe(eslint({
			fix: argv.fix
		}))
		.pipe(eslint.format())
		.pipe(gulpif(argv.strict, eslint.failAfterError()))
		.on('error', handleError)
		.pipe(gulpif(argv.fix, gulp.dest('./assets')));
});

gulp.task('lint-css', function() {
	return gulp.src(PATHS.styles.src.concat(['!**/jquery-ui-*']))
		.pipe(stylelint({
			reporters: [
				{formatter: 'string', console: true}
			],
			fix: argv.fix,
			failAfterError: argv.strict
		}))
		.on('error', handleError)
		.pipe(gulpif(argv.fix, gulp.dest('./assets')));
});

/*************************
 * Packaging for release *
 *************************/
// Builds all plugin files to path defined in `RELEASE_DIR`
gulp.task('bundle', ['assets', 'php'], function() {
	return gulp.src([RELEASE_DIR + '/**/*', '!*.zip'])
		.pipe(zip(PLUGIN_NAME + '.zip'))
		.pipe(gulp.dest(RELEASE_DIR));
});

gulp.task('assets', ['images', 'styles', 'scripts']);

gulp.task('default', ['assets']);

/****************
 *    Utils     *
 ****************/
function styleEventText(eventType) {
	switch (eventType) {
		case 'added':
			return chalk.green.underline(eventType);
		case 'changed':
			return chalk.yellow.underline(eventType);
		case 'deleted':
			return chalk.red.underline(eventType);
	}
}

function handleError(err) {
	console.log(err.toString());
	process.exit(1);
}
