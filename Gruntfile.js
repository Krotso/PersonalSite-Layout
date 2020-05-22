module.exports = function(grunt) {

    var globalConfig = {
        projectName: 'Empty'
    };

    grunt.initConfig({
        globalConfig: globalConfig,
        pkg: grunt.file.readJSON('package.json'),
        newer: {
            options: {
                tolerance: 1000
            }
        },
        clean: {
            dist: ['dist'],
            css: ['css/assets/**/*.*'],
            js: ['js/assets/**/*.*'],
            report: ['report']
        },
        sass: {
            development: {
                files: {
                    'css/main.css': 'sass/main.scss'
                }
            }
        },
        group_css_media_queries: {
            sample: {
                src: 'css/main.css',
                dest: 'css/main.css'
            }
        },
        concat: {
            js: {
                src: [
                    'node_modules/bootstrap/js/dist/util.js',
                    'node_modules/bootstrap/js/dist/dropdown.js',
                    'node_modules/bootstrap/js/dist/modal.js',
                    'js/assets/**/*.js',
                    'js/main.js'
                ],
                dest: 'dist/js/build.js'
            },
            css: {
                src: [
                    'css/assets/**/*.css',
                    'css/main.css'
                ],
                dest: 'dist/css/build.css'
            }
        },
        cssmin: {
            build: {
                options: {
                    specialComments: 0
                },
                files: {
                    'dist/css/build.min.css': ['dist/css/build.css']
                }
            }
        },
        uglify: {
            build: {
                src: ['dist/js/build.js'],
                dest: 'dist/js/build.min.js'
            }
        },
        imagemin: {
            build: {
                options: {
                    progressive: true,
                    optimizationLevel: 3,
                    removeViewBox: false
                },
                files: [{
                    expand: true,
                    cwd: 'img/',
                    src: ['**/*.png'],
                    dest: 'dist/img/',
                    ext: '.png'
                }, {
                    expand: true,
                    cwd: 'img/',
                    src: ['**/*.jpg', '**/*.jpeg'],
                    dest: 'dist/img/',
                    ext: '.jpg'
                }, {
                    expand: true,
                    cwd: 'img/',
                    src: ['**/*.svg', '!font/**'],
                    dest: 'dist/img/',
                    ext: '.svg'
                }, {
                    expand: true,
                    cwd: 'img/',
                    src: ['**/*.gif'],
                    dest: 'dist/img/',
                    ext: '.gif'
                }]
            }
        },
        includereplace: {
            htmlmodules: {
                options: {
                    includesDir: 'partials/'
                },
                src: '*.html',
                dest: 'dist/'
            }
        },
        prettify: {
            options: {
                indent: 2,
                indent_char: ' ',
                unformatted: [
                    "a",
                    "code",
                    "pre",
                    "img",
                    "br",
                    "span",
                    "p",
                    "i",
                    "em",
                    "b",
                    "strong"
                ]
            },
            html: {
                files: [
                    { expand: true, cwd: 'dist/', src: ['*.html'], dest: 'dist/', ext: '.html' }
                ]
            }
        },
        webfont: {
            icons: {
                src: 'img/font/*.svg',
                dest: 'dist/fonts',
                destCss: 'css/assets',
                options: {
                    font: '<%= globalConfig.projectName %>-icon-font',
                    engine: 'node',
                    relativeFontPath: '../fonts/',
                    htmlDemo: true,
                    destHtml: 'dist/',
                    autoHint: false,
                    types: 'woff',
                    template: 'webfont_template/tmpl.css',
                    syntax: 'bem',
                    templateOptions: {
                        baseClass: 'icon',
                        classPrefix: 'icon_'
                    }
                }
            }
        },
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({ browsers: ['last 2 version'] })
                ]
            },
            dist: {
                src: 'dist/css/build.css'
            }
        },
        copy: {
            main: {
                files: [
                    { expand: true, src: ['img/favicons/**'], dest: 'dist/', filter: 'isFile' },
                    { expand: true, src: ['fonts/**'], dest: 'dist/', filter: 'isFile' },
                    { expand: true, cwd: 'node_modules/jquery/dist', src: 'jquery.min.js', dest: 'dist/js/jquery' },
                    { expand: true, cwd: 'node_modules/normalize.css', src: 'normalize.css', dest: 'css/assets' },
                ],
            },
        },
        csslint: {
            strict: {
                options: {
                    csslintrc: '.csslintrc',
                    formatters: [
                        { id: 'checkstyle-xml', dest: 'report/csslint.xml' }
                    ]
                },
                src: ['css/main.css']
            }
        },
        jshint: {
            all: ['js/main.js'],
            options: {
                reporter: require('jshint-html-reporter'),
                reporterOutput: 'report/jshint.html'
            }
        },
        watch: {
            scripts: {
                files: ['js/*.js'],
                tasks: ['concat:js', 'uglify'],
                options: {
                    spawn: false,
                }
            },
            styles: {
                files: ['css/*.css'],
                tasks: [ /*'group_css_media_queries',*/ 'concat:css', 'postcss', 'cssmin' /*, 'uncss'*/ ],
                options: {
                    spawn: false,
                }
            },
            sass: {
                files: ['sass/*.scss'],
                tasks: ['sass', /* 'group_css_media_queries',*/ 'concat:css', 'postcss', 'cssmin' /*, 'uncss'*/ ],
                options: {
                    spawn: false,
                }
            },
            webfont: {
                files: ['img/font/*.svg'],
                tasks: ['webfont', /* 'group_css_media_queries',*/ 'concat:css', 'postcss', 'cssmin', 'copy' /*, 'uncss'*/ ],
                options: {
                    spawn: false,
                }
            },
            img: {
                files: ['img/**'],
                tasks: ['newer:imagemin:build'],
                options: {
                    spawn: false,
                }
            },
            html: {
                files: ['*.html', 'partials/**/*.html'],
                tasks: ['includereplace'],
                options: {
                    spawn: false,
                }
            },
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'dist/css/*.css',
                        'dist/js/*.js',
                        'dist/*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    server: './dist/',
                    port: '3010'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-webfont');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-include-replace');
    grunt.loadNpmTasks('grunt-prettify');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-group-css-media-queries');
    grunt.loadNpmTasks('grunt-uncss');

    grunt.registerTask('default', []);
    grunt.registerTask('clear', ['clean']);
    grunt.registerTask('build', ['clean', 'copy', 'sass', 'webfont', /*'csslint',*/ 'jshint', /*'group_css_media_queries',*/ 'concat', 'postcss', 'uglify', 'newer:imagemin:build', 'includereplace', 'prettify', 'cssmin' /*, 'uncss'*/ ]);
    grunt.registerTask('serve', ['browserSync', 'watch']);
    grunt.registerTask('lint', ['csslint', 'jshint']);

};