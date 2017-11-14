module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt)
  grunt.initConfig({
    eslint:{
      target:['src/**/*.js']
    },
    watch: {
      scripts: {
        files: 'src/**/*.js',
        tasks: ['eslint']
      }
    }
  });


  grunt.registerTask('default', ['watch']);

};