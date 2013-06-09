
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
      },<% if (kickstartPackage == 'bootstrap') { %>
      less: {
        files: ['app/less/{,*/}*.less}'],
        tasks: ['less', 'cssmin']
      },<% } else { %>
      sass: {
        files: ['app/sass/{,*/}*.{scss,sass}'],
        tasks: ['sass', 'cssmin']
      },<% } %>
      js: {
        files: ['app/js/**/*.js'],
        tasks: ['concat', 'uglify']
      },
      html: {
        files: ['app/html/**/*.hbs'],
        tasks: ['assemble']
      },
    },

    connect: {
      options: {
        port: 9000,
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

    concat: {
      <% if (kickstartPackage == 'foundation') { %>
      modernizr: {
        files: {
          'dist/js/modernizr.js': [ 'app/js/vendor/custom.modernizr.js' ],
        },
      },

      foundation: {
        src: [
          'app/js/vendor/jquery.js',
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
      html5shiv: {
        files: {
          'dist/js/html5shiv.js': [ 'app/js/lib/html5shiv.js' ],
        },
      },

      bootstrap: {
       src: [
         'app/js/lib/jquery.js',
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
      dist: {
        files: {
          'dist/js/frontend.min.js': [ 'dist/js/frontend.js' ]
        }
      }
    },

    assemble: {
      pages: {
        options: {
          data: 'app/data/*.{json,yml}',
          partials: 'app/html/partials/*.hbs',
          flatten: true,
          layout: 'app/html/layouts/default.hbs'
        },
        files: {
          'dist/html/':'app/html/pages/*.hbs'
        },
      },
    },

    copy: {
      js: {
        files : [ { expand: true, flatten: true, src: 'app/js/dist/*', dest: 'dist/js/', filter: 'isFile' } ]
      }
    },

    clean: {
      build: {
        src: ['dist']
      }
    }

  });


  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean',
      'production',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('production', [
    'clean',<% if (kickstartPackage == 'bootstrap') { %>
    'less',<% } else { %>
    'sass',<% } %>
    'cssmin',
    'concat',
    'uglify',
    'assemble'
  ]);

  grunt.registerTask('development', [
    'clean'
  ]);

  grunt.registerTask('html', [
    'clean',
    'assemble'
  ]);

  grunt.registerTask('default', [
    'production'
  ]);

};