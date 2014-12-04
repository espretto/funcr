module.exports = function (grunt) {

  grunt.initConfig({

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['src/f.js', 'Gruntfile.js', 'test/f.test.js']
    },

    uglify: {
      options: {
        // beautify: true,
        preserveComments: 'some',
        compress: {
          // global_defs: {
          //   "DEBUG": false
          // },
          // dead_code: true
        }
      },
      all: {
        files: {
          'dist/f.min.js': ['src/f.js']
        }
      }
    },

    browserify: {
      test: {
        files: {
          'test/f.test.bundle.js': 'test/f.test.js'
        }
      }
    }
  });

  // task libs
  [
    'grunt-contrib-uglify',
    'grunt-contrib-jshint',
    'grunt-browserify',
  ].forEach(grunt.loadNpmTasks, grunt);

  grunt.registerTask('default', [
    'jshint',
    'browserify',
    'uglify'
  ]);
};