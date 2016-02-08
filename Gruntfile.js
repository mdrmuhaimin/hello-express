module.exports = function(grunt) {
  // Do grunt-related things in here
 grunt.initConfig({
   pkg: grunt.file.readJSON('package.json'),
   express: {
    test: {
      options: {
        //port: 8080,
        script: './app.js'
      }
    }
  },
  mochaTest: {
      test: {
        options: {
        //    reporter: 'XUnit'
        },
        src: ['test/**/*.js']
      }
    }
 });
 grunt.loadNpmTasks('grunt-express-server');
 grunt.loadNpmTasks('grunt-mocha-test');
 grunt.registerTask('test', ['express:test', 'mochaTest']);
};
