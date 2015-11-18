//引入gulp
var gulp = require('gulp');


//引入组件
var lr = require('tiny-lr');
var server = lr();
var livereload = require('gulp-livereload');
var copy = require("gulp-copy");
var watch = require('gulp-watch');
var opn = require('opn');
var less = require('gulp-less');
var webserver = require('gulp-webserver');
var uglify = require('gulp-uglify');           //压缩
var imagemin = require('gulp-imagemin');
var minifyCss = require('gulp-minify-css');
var pngquant = require('imagemin-pngquant');
var htmlmin = require('gulp-htmlmin');

var webpack = require('gulp-webpack');
var WebpackDevServer = require('webpack-dev-server');

var config = require('./config.json');



//脚本检查
gulp.task('jshint', function () {
    gulp.src('./app/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('webpack:js', function() {
    return gulp.src(['app/js/user/app.js'])
        .pipe(named())
        .pipe(webpack())
        .pipe(gulp.dest('_dist/'));
});

//less
gulp.task('less', function () {
    return gulp.src('./less/zuan.less')
        .pipe(less())
        .pipe(gulp.dest('./app/css'));
});

gulp.task('minify-js',function(){
    return gulp.src('./app/js/build.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
})


//开启本地 Web 服务器功能
gulp.task('site:app', function () {
    gulp.src('./app')
        .pipe(webserver({
            host: config.localserver.host,
            port: config.localserver.port,
            livereload: true,
            directoryListing: false
        }));
    opn('http://'+config.localserver.port+ ':' +config.localserver.port)
});

gulp.task('site:dist', function () {
    gulp.src('./dist')
        .pipe(webserver({
            host: config.localserver.host,
            port: config.localserver.port,
            livereload: true,
            directoryListing: false
        }));
    opn('http://' + config.localserver.host + ':' + config.localserver.port)
});


//压缩图片
gulp.task('image', function () {
    return gulp.src('./app/images/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./dist/images'));
});

//压缩图片 - tinypng  要钱的，省着点花
gulp.task('png', function () {
    gulp.src('app/images/**/*.{png,jpg,jpeg}')
        .pipe(tinypng(config.tinypngapi))
        .pipe(gulp.dest('./app/images'));
});

gulp.task('webpack', function(){
    return gulp.src('./app/js')
        .pipe(webpack( require('./webpack.config.js') ))
        .pipe(gulp.dest('./app/js'));
});



//文件监控
gulp.task('watch', function () {
    server.listen(config.localserver.host, function (err) {
        if (err) {
            return console.log(err);
        }
    });
    gulp.watch('./less/**/*.less', function (e) {
        gulp.run('less');
    });
    gulp.watch('./app/js/build.js', function (e) {
        server.changed({
            body: {
                files: [e.path]
            }
        });
    });
    gulp.watch([ './app/**/*.html', './app/**/*.css'], function (e) {
        server.changed({
            body: {
                files: [e.path]
            }
        });
    });

});

/*
 *  css压缩
 * */
gulp.task('minify-css', function() {
    return gulp.src('./app/css/zuan.css')
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('./dist/css'));
});
/*
* minify-lib
* */
gulp.task('move-lib',function(){
    return gulp.src('./app/lib/')
        .pipe(gulp.dest('./dist/lib'));
});
gulp.task('minify-lib',['move-lib'],function(){
    return gulp.src('./app/lib/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/lib'));
});
/*
* html压缩移动
* */
gulp.task('html', function() {
    return gulp.src('./app/index.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build',['minify-js','minify-css','image','html'], function(){
    gulp.run('site:dist');
});

//默认任务
gulp.task('default', function () {
    console.log('开始任务，尽情的写代码吧!');
    gulp.run('less');
    gulp.run('watch');
    gulp.run('site:app');
});
