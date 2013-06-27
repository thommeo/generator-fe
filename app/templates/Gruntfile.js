
'use strict';

// Live Reload
var livereloadSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {

  // Load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.loadNpmTasks('assemble');

  var path = require('path');

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    watch: {
      options: {
        livereload: true,
        interrupt: true,
      },
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['watchcontexthelper:gruntfile'],
        options: {
          nospawn: true,
        },
      },<% if (kickstartPackage == 'bootstrap') { %>
      less: {
        files: ['app/less/{,*/}*.less'],
        tasks: ['watchcontexthelper:less'],
        options: {
          nospawn: true
        },
      },<% } else { %>
      sass: {
        files: ['app/sass/{,*/}*.{scss,sass}'],
        tasks: ['watchcontexthelper:sass'],
        options: {
          nospawn: true
        },
      },<% } %>
      js: {
        files: ['app/js/**/*.js'],
        tasks: ['watchcontexthelper:js'],
        options: {
          nospawn: true
        },
      },
      img: {
        files: ['app/img/**/*'],
        tasks: ['watchcontexthelper:img'],
        options: {
          nospawn: true
        },
      },
      html: {
        files: ['app/html/**/*.hbs'],
        tasks: ['watchcontexthelper:html'],
        options: {
          nospawn: true
        },
      },
    },

    connect: {
      options: {
        port: 9090,
        hostname: 'localhost' // change this to '0.0.0.0' to access the server from outside
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              livereloadSnippet,
              mountFolder(connect, 'dist')
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, 'dist')
            ];
          }
        }
      }
    },

    open: {
      server: {
        path: 'http://localhost:<%%= connect.options.port %>/html/'
      }
    },
    <% if (kickstartPackage == 'bootstrap') { %>
    less: {
      main: {
        files: {
          'dist/css/main.css': 'app/less/app/main.less',
        },
      },
      mainResponsive: {
        files: {
          'dist/css/main-responsive.css': 'app/less/app/main-responsive.less',
        },
      },
    },<% } else if (kickstartPackage == 'bootstrap-sass') { %>
    sass: {
      main: {
        files: {
          'dist/css/main.css': 'app/sass/app/main.scss',
        },
      },
      mainResponsive: {
        files: {
          'dist/css/main-responsive.css': 'app/sass/app/main-responsive.scss',
        },
      },
    },<% } else { %>
    sass: {
      main: {
        files: {
          'dist/css/main.css': 'app/sass/app/main.scss',
        },
      },
    },<% } %>

    cssmin: {
      minify: {
        options: {},
        expand: true,
        cwd: 'dist/css/',
        src: [ '*.css', '!*.min.css' ],
        dest: 'dist/css/',
        ext: '.min.css',
      }
    },

    concat: {<% if (kickstartPackage == 'foundation') { %>
      js: {
        src: [
          'app/js/foundation/foundation.js',
          'app/js/foundation/foundation.alerts.js',
          'app/js/foundation/foundation.clearing.js',
          'app/js/foundation/foundation.cookie.js',
          'app/js/foundation/foundation.dropdown.js',
          'app/js/foundation/foundation.forms.js',
          'app/js/foundation/foundation.interchange.js',
          'app/js/foundation/foundation.joyride.js',
          'app/js/foundation/foundation.magellan.js',
          'app/js/foundation/foundation.orbit.js',
          'app/js/foundation/foundation.placeholder.js',
          'app/js/foundation/foundation.reveal.js',
          'app/js/foundation/foundation.section.js',
          'app/js/foundation/foundation.tooltips.js',
          'app/js/foundation/foundation.topbar.js',
          'app/js/app/app.js',
        ],
        dest: 'dist/js/frontend.js'
      },<% } else { %>
      js: {
       src: [
         'app/js/bootstrap/bootstrap-affix.js',
         'app/js/bootstrap/bootstrap-alert.js',
         'app/js/bootstrap/bootstrap-button.js',
         'app/js/bootstrap/bootstrap-carousel.js',
         'app/js/bootstrap/bootstrap-collapse.js',
         'app/js/bootstrap/bootstrap-dropdown.js',
         'app/js/bootstrap/bootstrap-modal.js',
         'app/js/bootstrap/bootstrap-tooltip.js',
         'app/js/bootstrap/bootstrap-popover.js',
         'app/js/bootstrap/bootstrap-scrollspy.js',
         'app/js/bootstrap/bootstrap-tab.js',
         'app/js/bootstrap/bootstrap-transition.js',
         'app/js/bootstrap/bootstrap-typeahead.js',
         'app/js/app/app.js',
       ],
       dest: 'dist/js/frontend.js'
      },<% } %>
    },

    uglify: {
      options: {},
      vendor: {
        files: [
          { expand: true, cwd: 'dist/js/vendor/', src: [ '**/*.js', '!**/*.min.js' ], dest: 'dist/js/vendor/', ext: '.min.js' },
        ]
      },
      frontend: {
        files: [
          { 'dist/js/frontend.min.js': 'dist/js/frontend.js' },
        ]
      },
    },

    assemble: {
      options: {
        data: 'app/html/data/*.{json,yml}',
        partials: 'app/html/partials/**/*.hbs',
      },
      development: {
        options: {
          production: false
        },
        files: [
          { expand: true, cwd: 'app/html/pages/', src: ['**/*.hbs'], dest: 'dist/html/' }
        ],
      },
      production: {
        options: {
          production: true
        },
        files: [
          { expand: true, cwd: 'app/html/pages/', src: ['**/*.hbs'], dest: 'dist/html/' }
        ],
      },
    },

    copy: {
      js: {
        files: [
          { expand: true, cwd: 'app/js/vendor/', src: '**/*', dest: 'dist/js/vendor/', filter: 'isFile' },
        ],
      },
      img: {
        files: [
          { expand: true, cwd: 'app/img/', src: '**/*', dest: 'dist/img/' },
        ],
      },
      html: {
        files: [
          { expand: true, cwd: 'app/html/pages/', src: '**/*.html', dest: 'dist/html/' },
        ],
      },
    },

    clean: {
      dist: [ 'dist' ],
      js: [ 'dist/js' ],
      css: [ 'dist/css' ],
      html: [ 'dist/html' ],
      img: [ 'dist/img' ],
      devjs: [ 'dist/js/**/*.js', '!dist/js/**/*.min.js' ],
      devcss: [ 'dist/css/*.css', '!dist/css/*.min.css' ],
    }
  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run([
        'development',
        'connect:dist:keepalive',
        'open'
      ]);
    }

    if (target === 'production') {
      grunt.watchcontext = 'production';
      return grunt.task.run([
        'production',
        'connect:livereload',
        'open',
        'watch',
      ]);
    }

    grunt.task.run([
      'development',
      'connect:livereload',
      'open',
      'watch',
    ]);
  });


  grunt.registerTask('watchcontexthelper', function (target){
    switch (target) {
      case 'gruntfile':
        console.log('Spawning a child process for complete rebuild...');
        var child;

        var showDone = function(){
          console.log('Done');
        }

        if (grunt.watchcontext === 'production') {
          child = grunt.util.spawn({ grunt: true, args: ['production'] }, showDone);
        } else {
          child = grunt.util.spawn({ grunt: true, args: ['development'] }, showDone);
        }
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
        break;
      case 'js':
        (grunt.watchcontext === 'production') ?
        grunt.task.run(['clean:js', 'copy:js', 'concat', 'uglify', 'clean:devjs']) :
        grunt.task.run(['clean:js', 'copy:js', 'concat']);
        break;
      case 'img':
        (grunt.watchcontext === 'production') ?
        grunt.task.run(['clean:img', 'copy:img']) :
        grunt.task.run(['clean:img', 'copy:img']);
        break;
      case 'html':
        (grunt.watchcontext === 'production') ?
        grunt.task.run(['clean:html', 'copy:html', 'assemble:production']) :
        grunt.task.run(['clean:html', 'copy:html', 'assemble:development']);
        break;<% if (kickstartPackage == 'bootstrap') { %>
      case 'less':
        (grunt.watchcontext === 'production') ?
        grunt.task.run(['clean:css', 'less', 'cssmin', 'clean:devcss']) :
        grunt.task.run(['clean:css', 'less']);
        break;<% } else { %>
      case 'sass':
        (grunt.watchcontext === 'production') ?
        grunt.task.run(['clean:css', 'sass', 'cssmin', 'clean:devcss']) :
        grunt.task.run(['clean:css', 'sass']);
        break; <% } %>
    }
  });

  grunt.registerTask('production', [
    'clean:dist',
    'concat',<% if (kickstartPackage == 'bootstrap') { %>
    'less',<% } else { %>
    'sass',<% } %>
    'cssmin',
    'clean:devcss',
    'copy:img',
    'copy:js',
    'uglify',
    'clean:devjs',
    'copy:html',
    'assemble:production'
  ]);

  grunt.registerTask('development', [
    'clean:dist',
    'concat',<% if (kickstartPackage == 'bootstrap') { %>
    'less',<% } else { %>
    'sass',<% } %>
    'copy:img',
    'copy:js',
    'copy:html',
    'assemble:development'
  ]);

  grunt.registerTask('dev', [
    'development'
  ]);

  grunt.registerTask('default', [
    'production'
  ]);

};