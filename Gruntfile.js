module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json')

  grunt.initConfig({
    requirejs : {
      funcr : {
        options : {
          baseUrl: 'src/',
          name: 'funcr',
          out: 'built/funcr.amd.js',
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-requirejs')

  grunt.registerTask('default', 'requirejs:funcr')
};