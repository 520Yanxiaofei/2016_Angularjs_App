(function() {
    'use strict';
    var gulp = require('gulp');
    var path = require('path');
    var gulpsync = require('gulp-sync')(gulp)
    var clean = require('gulp-clean');
    var chug = require('gulp-chug');
    
    
    //清除build
    gulp.task('clean', function() {
        return gulp.src(['build/seller','build/mall','build/show'], {
                read: false
            })
            .pipe(clean());
        
    });


    //编译seller
    gulp.task('buildSeller', function() {
        
        return gulp.src( './business-manager/gulpfile.js' )
            .pipe( chug( {
                nodeCmd: 'node',
                tasks:  [ 'build' ]
            } ) );

    });

    //编译mall
    gulp.task('buildMall', function() {

        return gulp.src( './business-shop/gulpfile.js' )
            .pipe( chug( {
                nodeCmd: 'node',
                tasks:  [ 'build' ]
            } ) );

    });

    //编译show
    gulp.task('buildShow', function() {
        
        return gulp.src( './daiyan-show/gulpfile.js' )
            .pipe( chug( {
                nodeCmd: 'node',
                tasks:  [ 'build' ]
            } ) );

    });

    //拷贝seller
    gulp.task('copySeller' , function (){
        var seller;
        seller = gulp.src('business-manager/build/**/*.*');
        return seller.pipe(gulp.dest('build/seller'));
       
    });

    //拷贝mall
    gulp.task('copyMall' , function (){
        var mall,show;
        mall = gulp.src('business-shop/build/**/*.*');
        return mall.pipe(gulp.dest('build/mall'));
    });

    //拷贝show
    gulp.task('copyShow' , function (){
        var show;
        show = gulp.src('daiyan-show/build/**/*.*');
        return show.pipe(gulp.dest('build/show')); 
    });

    //删除源seller build
    gulp.task('cleanSeller',function (){
        return  gulp.src(['business-manager/build'], {
                read: false
            })
            .pipe(clean());
         
    });

    //删除源mall build
    gulp.task('cleanMall',function (){
        return  gulp.src(['business-shop/build'], {
                read: false
            })
            .pipe(clean());
        
    });

    //删除源show build
    gulp.task('cleanShow',function (){
        return gulp.src(['daiyan-show/build'], {
                read: false
            })
            .pipe(clean());
        
    });
    
    //编译所有子项目
    gulp.task('build', ['buildSeller', 'buildMall' , 'buildShow'  ]);

    //拷贝子项目
    gulp.task('copy' , ['copySeller', 'copyMall' , 'copyShow'  ]);

    //清除子项目的build
    gulp.task('cleanSub', ['cleanSeller', 'cleanMall' , 'cleanShow'  ]);

    //发布项目
    gulp.task('default', gulpsync.sync([ 'clean' , 'build' , 'copy'  ]));
})();