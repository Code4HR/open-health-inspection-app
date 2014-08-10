module.exports = function(grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            // 2. Configuration for concatinating files goes here.
          dist: {
          src: [
            'js/*.js', '!js/production.js', '!js/production.min.js'
          ],
            dest: 'dist/production.js',
          },
            styles: {
              src: [
                'css/main.css', 'css/776up.css', 'css/992up.css', 'css/1200up.css', '!css/production.css', '!css/production.min.css'
              ],
              dest: 'css/production.css'
            }
        },

        uglify: {
            build: {
                src: 'js/production.js',
                dest: 'js/production.min.js'
            }
        },

        cssmin: {
            minify: {
              expand: true,
              cwd: 'css/',
              src: 'production.css',
              dest: 'css/',
              ext: '.min.css'
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'img/',
                    src: ['**/*.{png,jpg,gif}', '!build/*.{png,jpg,gif}'],
                    dest: 'img/build/'
                }]
            }
        },

        watch: {
            scripts: {
                files: ['js/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                },
            },
            styles: {
                files: ['css/*.css'],
                tasks: ['concat', 'cssmin'],
                options: {
                    spawn: false,
                }
            },
            images: {
                files: ['img/*.{png,jpg,gif}'],
                tasks: ['imagemin'],
                options: {
                    spawn: false,
                }
            }
        },
        connect: {
          server : {
            options : {
              port : 9090,
              keepalive : true
            }
          },
          keepalive : true,
          livereload : true
        },
        open: {
          dev: {
            // Gets the port from the connect configuration
            path: 'http://localhost:<%= connect.all.options.port%>'
          }
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');


    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('build', ['concat', 'uglify', 'cssmin', 'imagemin']);
    grunt.registerTask('server', ['connect','open:dev','watch']);

};
