module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist: 'dist/**'
        },
        watch: {
            build: {
                files: ['src/**/*.js'],
                tasks: ['build']
            }
        },

        webpack: require('./webpack.config.js')
    });

    grunt.registerTask('build', 'Run webpack and bundle the source', ['clean', 'webpack']);
};