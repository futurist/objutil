module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            options: {
                asi: true,
                laxbreak:true,
                es3: true,
                unused: false,
                curly: false,
                eqeqeq: false,
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

