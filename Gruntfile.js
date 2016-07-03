module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      options: {
        esversion: 6,
        // es3: true,
        asi: true,
        laxbreak:true,
        unused: false,
        curly: false,
        eqeqeq: false,
        "-W041": false,         // '===' to compare with '0'
        "-W083": false,         // Don't make functions within a loop
        expr: true,
        eqnull: true,
        proto: true
      },
      files: [
        "src/**/*.js",
        "test/**/*.js"
      ]
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.registerTask("default", ["jshint"]);
};

