(function() {
	'use strict';
	var gulp = require('gulp');
	var less = require('gulp-less');
	var path = require('path');
	var replace = require('gulp-replace-task');
	var useref = require('gulp-useref');
	var gulpsync = require('gulp-sync')(gulp)
	var inlineAngularTemplates = require('gulp-inline-angular-templates');
	var templateCache = require('gulp-angular-templatecache');
	var uglify = require('gulp-uglify');
	var minifyCss = require('gulp-minify-css');
	var rev = require('gulp-rev');
	var gulpif = require('gulp-if');
	var clean = require('gulp-clean');
	var revCollector = require('gulp-rev-collector');
	var livereload = require('gulp-livereload');
	var angularFilesort = require('gulp-angular-filesort');
	var inject = require('gulp-inject');
	var concat = require('gulp-concat');
	var cdn = require('gulp-cdn-replace');
	// var connect = require('gulp-connect');

	//编译less
	// gulp.task('less', function() {
	// 	return gulp.src('./src/app.less')
	// 		.pipe(less({
	// 			paths: [path.join(__dirname, 'less', 'includes')]
	// 		}))
	// 		.pipe(gulp.dest('./src'));
	// });

	//合并编译less
	gulp.task('less', function() {
		return gulp.src(['./src/**/*.less', '!src/app.less','!src/bower_components/**/*.less'])
			.pipe(concat('app.less'))
			.pipe(gulp.dest('./src/'))
			.pipe(less())
			.pipe(gulp.dest('./src/'));
	});

	//自动加载js
	gulp.task('loadjs', function() {
		gulp.src('./index.html')
			.pipe(inject(gulp.src('src/**/*.js').pipe(angularFilesort()), {
				relative: true
			}))
			.pipe(gulp.dest('./src'));

	});

	//字符串替换
	gulp.task('replace', function() {
		gulp.src('/index.html')
			.pipe(replace({
				patterns: [{
					match: '/business-manager/src/',
					replacement: '/business-manager/build/'
				}]
			}))
			.pipe(gulp.dest('build'));
	});

	//angularTemplates 合并
	gulp.task('inlineAngularTemplates', function() {
		return gulp.src('src/*/**/*.html')
			.pipe(inlineAngularTemplates('build/index.html', {
				base: 'src', // (Optional) ID of the <script> tag will be relative to this folder. Default is project dir.
				unescape: { // (Optional) List of escaped characters to unescape
					'&apos;': '\''
				}
			}))
			.pipe(gulp.dest('build'));
	});

	//合并打包压缩js css
	gulp.task('useref', function() {
		return gulp.src('src/index.html')
			.pipe(useref())
			.pipe(gulpif('*.js', uglify()))
			.pipe(gulpif('*.css', minifyCss()))
			.pipe(gulp.dest('tmp'));
	});

	//加入md5 replaceMD5
	gulp.task('rev', function() {
		return gulp.src(['tmp/js/*.js', 'tmp/css/*.css'], {
				base: 'tmp'
			})
			.pipe(rev())
			.pipe(gulp.dest("build"))
			.pipe(rev.manifest()) //- 生成一个rev-manifest.json
			.pipe(gulp.dest('tmp/rev'))
	})

	//替换index.html 引用路径
	gulp.task('revCollector', function() {
		return gulp.src(['tmp/rev/*.json', 'tmp/index.html']) //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
			.pipe(revCollector()) //- 执行文件内css名的替换
			.pipe(gulp.dest('build/')); //- 替换后的文件输出的目录
	});

	//copy文件
	gulp.task('copy', ['copyImg', 'copySvg', 'copyhtml','copyCity']);

	gulp.task('copyImg', function() {
		return gulp.src('src/image/*.*')
			.pipe(gulp.dest("build/image"));
	})

	gulp.task('copySvg', function() {
		return gulp.src('src/bower_components/ionic/release/fonts/**/*.*')
			.pipe(gulp.dest("build/fonts"));
	})

	gulp.task('copyhtml', function() {
		return gulp.src('tmp/*.html')
			.pipe(gulp.dest("build/"));
	})

	gulp.task('copyCity',function(){
		return gulp.src('src/widgets/city/*.json')
			   .pipe(gulp.dest('build/widgets/city'));
	});
	//clean发布目录和临时目录
	gulp.task('clean', function() {
		return gulp.src(['build/', 'tmp/'], {
				read: false
			})
			.pipe(clean());
	})

	//clean临时目录
	gulp.task('cleanTmp', function() {
		return gulp.src(['tmp'], {
				read: false
			})
			.pipe(clean());
	})

	//livereload 改变文件实时刷新页面
	gulp.task('livereload', function() {
		livereload.listen({
			// port: '8000',
			// host: '127.0.0.1'
		});

		// src/**/*.*的意思是 src文件夹下的 任何文件夹 的 任何文件
		gulp.watch('src/**/*.*', function(file) {
			livereload.changed(file.path)
		});
	});

	// //生成模板临时文件templates.js
	// gulp.task('templateCache', function() {
	// 	return gulp.src('src/*/**/*.html')
	// 		.pipe(templateCache('templates.js', {
	// 			module: 'shopManagerApp',
	// 			root: ''
	// 		}))
	// 		.pipe(gulp.dest('tmp/js'));
	// });

	// //引入模板临时文件templates.js
	// gulp.task('loadTemplateCache', function() {
	// 	gulp.src('tmp/index.html')
	// 		.pipe(inject(gulp.src('tmp/js/templates.js', {
	// 			read: false
	// 		}), {
	// 			relative: true
	// 		}))
	// 		.pipe(gulp.dest('tmp'));
	// });

	//开发watch生成模板临时文件templates.js
	gulp.task('templateCache', function() {
		return gulp.src(['src/*/**/*.html', '!src/bower_components/**/*.html'])
			.pipe(templateCache('templates.js', {
				module: 'shopManagerApp',
				root: ''
			}))
			.pipe(gulp.dest('src'));
	});


	//监听编译css 自动加载angular依赖文件
	gulp.task('watch', ['less', 'livereload', 'templateCache'], function() {
		gulp.watch('./src/**/*.less', ['less']);
		gulp.watch('./src/**/*.html', ['templateCache']);

	});

	//cdn
	gulp.task('cdn', function() {
		gulp.src('build/*.html')
			.pipe(cdn({
				dir: './build',
				root: {
					js: 'http://static-3.520dyw.cn',
					css: 'http://static-3.520dyw.cn'
				}
			}))
			.pipe(gulp.dest('./build'));
	});

	//发布项目
	gulp.task('build', gulpsync.sync(['clean', 'less', 'templateCache', 'useref', 'copy', 'rev', 'revCollector', 'cleanTmp','cdn']))
})();
