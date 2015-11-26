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

var config = require('../../config.json');



//脚本检查
gulp.task('jshint', function () {
    gulp.src('./js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


//less
gulp.task('less', function () {
    return gulp.src('../../less/zuan.less')
        .pipe(less())
        .pipe(gulp.dest('./css'));
});

gulp.task('minify-js',function(){
    return gulp.src('./js/build.js')
        .pipe(uglify())
        .pipe(gulp.dest('../../dist/baofen/js/'));
})


//开启本地 Web 服务器功能
gulp.task('site:app', function () {
    gulp.src('../')
        .pipe(webserver({
            host: config.localserver.host,
            port: config.localserver.port,
            livereload: true,
            directoryListing: false
        }));
    opn('http://' + config.localserver.host + ':' + config.localserver.port)
});

gulp.task('site:dist', function () {
    gulp.src('../../dist')
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
    return gulp.src('./images/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('../../dist/baofen/images'));
});



gulp.task('webpack', function(){
    return gulp.src('./js')
        .pipe(webpack( require('./webpack.config.js') ))
        .pipe(gulp.dest('./js'));
});



//文件监控
gulp.task('watch', function () {
    server.listen(config.localserver.host, function (err) {
        if (err) {
            return console.log(err);
        }
    });
    gulp.watch('../../less/**/*.less', function (e) {
        gulp.run('less');
    });
    gulp.watch('./js/build.js', function (e) {
        server.changed({
            body: {
                files: [e.path]
            }
        });
    });
    gulp.watch([ './index.html', './css/zuan.css'], function (e) {
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
    return gulp.src('./css/zuan.css')
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('../../dist/baofen/css'));
});
/*
* minify-lib
* */
gulp.task('move-lib',function(){
    return gulp.src('../lib')
        .pipe(gulp.dest('../../dist/lib'));
});
gulp.task('minify-lib',['move-lib'],function(){
    return gulp.src('../lib/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('../../dist/lib'));
});
/*
* html压缩移动
* */
gulp.task('html', function() {
    return gulp.src('./index.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('../../dist/baofen'));
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
