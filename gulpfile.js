const   gulp    = require('gulp')
,       path    = require('path')
,       $       = require('gulp-load-plugins')()
,       pkg     = require('./package.json');

var banner = ['/**'
,   ' * @name <%= pkg.name %>'
,   ' * @version v<%= pkg.version %>'
,   ' * @author <%= pkg.author.name %> <%= pkg.author.email %>'
,   ' * @license <%= pkg.license %>'
,   ' */'
,   ''
].join('\n');

gulp.task('build:header', function() {
    return gulp.src('src/recaptcha.js')
        .pipe($.header(banner, {pkg: pkg}))
        .pipe($.rename('angular-g-recaptcha.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('build:uglify', function() {
    return gulp.src('src/recaptcha.js')
        .pipe($.uglify())
        .pipe($.header(banner, {pkg: pkg}))
        .pipe($.rename('angular-g-recaptcha.min.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
    gulp.watch(['src/recaptcha.js'], ['build']);
})

gulp.task('build', ['build:header', 'build:uglify']);

gulp.task('default', ['build', 'watch']);