
var webpack = require('webpack')
var path = require('path')

function toAbsolute(rel) {
  return path.join(__dirname, rel)
}

module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json')

  grunt.initConfig({

    pkg: pkg,

    requirejs : {
      extension : {
        options : {
          baseUrl: 'src/',
          name: 'funcr',
          // optimize: 'none',
          out: 'dist/funcr.amd-<%=pkg.version%>.js',
        }
      },
      standalone: {
        options : {
          baseUrl: 'src/',
          name: 'almond',
          include: ['funcr'],
          // optimize: 'none',
          paths: {
            almond: '../node_modules/almond/almond'
          },
          wrap: {
            startFile: 'src/frag/almond.wrap.js',
            endFile: 'src/frag/almond.up.js'
          },
          out: 'dist/funcr.almond-<%=pkg.version%>.js'
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-requirejs')

  grunt.registerTask('default', [
    'requirejs:extension',
    'requirejs:standalone'
  ])
}
