
var webpack = require('webpack')

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
          out: 'built/funcr.amd-<%=pkg.version%>.js',
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
          out: 'built/funcr.almond-<%=pkg.version%>.js'
        }
      }
    },

    webpack: {
      standalone: {
        context: './src',
        entry: './funcr',
        output: {
          libraryTarget: "umd",
          library: 'funcr',
          path: 'built/',
          filename: "funcr.webpack-<%=pkg.version%>.js"
        },
        plugins: [
          new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            compress: {
              warnings: false,
            }
          })
        ]
      }
    }
  })

  grunt.loadNpmTasks('grunt-requirejs')
  grunt.loadNpmTasks("grunt-webpack");

  grunt.registerTask('default', [
    'requirejs:extension',
    'requirejs:standalone',
    'webpack:standalone'
  ])
}
