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


gulp.task('build:coffee', function() {
    return gulp.src('src/recaptcha.coffee')
        .pipe($.coffee({bare:true, 'no-header':true}))
        .pipe($.rename('angular-g-recaptcha.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('build:header', ['build:coffee'], function() {
    return gulp.src('angular-g-recaptcha.js')
        .pipe($.header(banner, {pkg: pkg}))
        .pipe(gulp.dest('./'));
});

gulp.task('build:uglify', ['build:coffee'], function() {
    return gulp.src('angular-g-recaptcha.js')
        .pipe($.uglify())
        .pipe($.header(banner, {pkg: pkg}))
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
    gulp.watch(['src/recaptcha.coffee'], ['build']);
})

gulp.task('build', ['build:header', 'build:uglify']);

gulp.task('default', ['build', 'watch']);