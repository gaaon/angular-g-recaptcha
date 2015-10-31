const   gulp        = require('gulp')
,       path        = require('path')
,       $           = require('gulp-load-plugins')({
    rename: {
        'gulp-util': 'gutil'
    }
})
,       pkg         = require('./package.json')
,       browserSync = require('browser-sync').create();

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
        .pipe($.ngAnnotate({add:true, remove:true}))
        .pipe($.rename('angular-g-recaptcha.js'))
        .pipe(gulp.dest('./'));
});



gulp.task('build:concat', function(){
    return gulp.src(
        [
            'src/minErr.js',
            'src/**/!(public)*.js',
            'src/public.js'
        ])
        .pipe($.insert.append('\n\n'))
        .pipe($.concat('angular-g-recaptcha.js'))
        .pipe($.ngAnnotate({add:true, remove:true}))
        .pipe(gulp.dest('./'));
});




gulp.task('build:header', ['build:concat'], function() {
    return gulp.src('./angular-g-recaptcha.js')
        .pipe($.wrap('(function(window, angular){\n\n<%=contents%>})(window, window.angular)'))
        .pipe($.ngAnnotate({add:true, remove:true}))
        .pipe($.header(banner, {pkg: pkg}))
        .pipe(gulp.dest('./'))
        .pipe($.copy('example/scripts'));
});





gulp.task('build:uglify', ['build:concat'], function() {
    return gulp.src('./angular-g-recaptcha.js')
        .pipe($.wrap('(function(window, angular){\n\n<%=contents%>})(window, window.angular)'))
        .pipe($.uglify())
        .pipe($.header(banner, {pkg: pkg}))
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest('./'));
});




gulp.task('browserSync:init', function(){
    browserSync.init({
        proxy: 'localhost:8000',
        port: process.env.PORT,
        socket: {
            domain: require('./browserSyncDomain')
        }
    });
});




gulp.task('webserver', ['watch'], function(){
    return gulp.src('example')
    .pipe($.webserver({
        host: 'localhost',
        path: '/example',
        port: '8000'
    }))
    .on('error', $.gutil.log);
});




gulp.task('watch', ['browserSync:init'], function() {
    gulp.watch(['src/**/*.js'], ['build']).on('change', browserSync.reload);
    gulp.watch(['example/**/*.html']).on('change', browserSync.reload);
})


gulp.task('build', ['build:header', 'build:uglify']);

gulp.task('default', ['build', 'watch']);