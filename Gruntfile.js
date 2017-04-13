/* jshint -W069 */

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      build: ['build'],
    },
    'gh-pages': {
      options: {
        base: 'build',
        branch: 'master'
      },
      src: ['**']
    },
    copy: {
      js: {
        files: [{
          expand: true,
          cwd: 'src/js',
          src: ['**/*.js'],
          dest: 'build/js'
        }]
      },
      html: {
        files: [{
          expand: true,
          cwd: 'src/html',
          src: ['**/*.html'],
          dest: 'build/'
        }]
      },
      md: {
        files: [{
          expand: true,
          cwd: 'src/md',
          src: ['**/*.md'],
          dest: 'build/'
        }]
      },
      img: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['img/**'],
          dest: 'build/'
        }]
      },
    },
    watch: {
      options: {
        nospawn: true,
        interrupt: false,
        debounceDelay: 250
        // livereload: true,
        // livereload: 1337
      },
      grunt: {
        files: ['Gruntfile.js'],
        tasks: ['build']
      },
      sass: {
        files: ['src/sass/*.scss'],
        tasks: ['sass']
      },
      js: {
        files: ['src/js/**/*.js'],
        tasks: ['copy:js']
      },
      html: {
        files: ['src/html/**/*.html'],
        tasks: ['copy:html']
      }
    },

    sass: {
      dev: {
        options: {
          style: 'expanded'
        },
        files: {
          'build/css/styles.css': 'src/sass/styles.scss'
        }
      }
    },
    // grunt-contrib-connect will serve the files of the project
    // on specified port and hostname
    connect: {
      all: {
        options: {
          useAvailablePort: true,
          port: 3333,
          hostname: "0.0.0.0",
          // Prevents Grunt to close just after the task (starting the server) completes
          // This will be removed later as `watch` will take care of that
          // keepalive: true,

          base: './build',

        }
      }
    },
    reload: {
      port: 35729,
      liveReload: {},
      proxy: {
        host: "localhost",
        port: '<%= connect.all.options.port%>'
      }
    },
    // grunt-open will open your browser at the project's URL
    open: {
      all: {
        // Gets the port from the connect configuration
        path: 'http://localhost:<%= connect.all.options.port%>'
      }
    }
  });

  grunt.registerTask('default', ['build', 'server', 'watch']);

  grunt.registerTask('nodsstore', function() {
    grunt.file.expand({
      filter: 'isFile',
      cwd: '.'
    }, ['**/.DS_Store']).forEach(function(file) {
      grunt.file.delete(file);
    });
  });
  // Creates the `server` task
  grunt.registerTask('server', [
    'connect',
    'reload',
    'open'
  ]);

  grunt.registerTask('build', ['sass', 'copy']);
  grunt.registerTask('rebuild', ['clean', 'build']);
  grunt.registerTask('deploy', ['build', 'gh-pages']);
};
