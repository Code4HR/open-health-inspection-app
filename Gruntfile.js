module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            // 2. Configuration for concatinating files goes here.
    	    dist: {
    		  src: [
    		    'js/**/*.js', '!js/build/*.js'
    		  ],
    		    dest: 'js/production.js',
    	    },
            styles: {
              src: [
                'css/main.css', 'css/776up.css', 'css/992up.css', 'css/1200up.css', '!css/build/*.css'
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
                files: ['js/**/*.js'],
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
        }

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'imagemin']);

};

