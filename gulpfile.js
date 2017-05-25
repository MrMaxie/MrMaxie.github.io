var gulp     = require('gulp'),
	less     = require('gulp-less'),
	gutil    = require('gulp-util'),
	clip     = require('gulp-clip-empty-files'),
	prefix   = require('gulp-autoprefixer'), 
	combiner = require('stream-combiner2');

gulp.task('less', function()
{
	// Combiner
	var combined = combiner.obj([
		gulp.src('./less/main.less'),
		less(),
		clip(),
		prefix({
			browsers: ['last 100 versions'],
			flexbox: true,
			remove: false
		}),
		gulp.dest('./css')
	]);
	// Error handler for LESS
	combined.on('error', function(e) {
		gutil.log(
			'['+gutil.colors.red('Error Less')+']',
			e.filename,
			gutil.colors.magenta('->'),
			e.line
		);
		combined.emit('end');
	});
	return combined;
});

gulp.task('watch', function() {
	gulp.watch('./less/**/*.less', ['less']);
});
