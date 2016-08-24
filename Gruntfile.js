/*
    The frontend for Code for Hampton Roads' Open Health Inspection Data.
    Copyright (C) 2014  Code for Hampton Roads contributors.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var stringify = require('stringify');

module.exports = function(grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            // 2. Configuration for concatinating files goes here.
          dist: {
          src: [
            'js/*.js', 'js/controllers/*.js', '!js/production.js', '!js/production.min.js', '!js/modules/**/*.js'
          ],
            dest: 'dist/production.js',
          },
        },

        uglify: {
            build: {
                src: 'dist/production.js',
                dest: 'dist/production.min.js'
            }
        },

        sass: {
          dist: {
            options : {
              style: 'expanded'
            },
            files: {
              'dist/main.css': 'scss/main.scss', // 'destination': 'source'
            }
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

        browserify: {
          dist: {
            files: {
              'js/modules.js': ['js/modules/**/*.js'],
            },
            options: {
              transform: ['stringify']
            }
          }
        },

        watch: {
            scripts: {
                files: ['js/*.js', 'js/controllers/*.js', 'js/modules/**/*.{js,html}'],
                tasks: ['browserify','concat', 'uglify'],
                options: {
                    spawn: false,
                    livereload: true
                },
            },
            styles: {
                files: ['scss/**/*.scss', 'scss/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            images: {
                files: ['img/*.{png,jpg,gif}'],
                tasks: ['imagemin'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },

        },

        connect: {
          server : {
            options : {
              port : 9090,
              keepalive : false,
              livereload : true
            }
          },
        },

        open: {
          dev: {
            // Gets the port from the connect configuration
            path: 'http://localhost:<%= connect.server.options.port%>'
          }
        }

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-sass');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('build', ['browserify', 'concat', 'uglify', 'imagemin']);
    grunt.registerTask('default', ['connect','open:dev','watch']);

};
