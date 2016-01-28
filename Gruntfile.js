module.exports = function(grunt) {  
  grunt.loadNpmTasks('grunt-jasmine-node-coverage');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.initConfig({ 
    jasmine_node: {
      coverage: {
      },
      options: {
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec',
        captureExceptions: true,
        junitreport: {
          report: false,
          savePath : "./build/reports/jasmine/",
          useDotNotation: true,
          consolidate: true
        }
      }
    },
    jshint: {
      ignore_warning: {
        // Ignore a specific warning that is not really a problem in our code
        options: {
          '-W083': true,
        },
        src: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
      }
    }
  });

  // Default task.  
  grunt.registerTask('default', 'jasmine_node');  
  grunt.registerTask('test', 'jasmine_node');
};