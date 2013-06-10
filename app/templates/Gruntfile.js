
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
      vendor: {
        files: [
          { 'dist/js/vendor/jquery.js': 'app/js/vendor/jquery.js' },
          { 'dist/js/vendor/modernizr.js': 'app/js/vendor/custom.modernizr.js' },
        ]
      },
      frontend: {
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
      vendor: {
        files: [
          { 'dist/js/vendor/jquery.js': 'app/js/vendor/jquery.js' },
          { 'dist/js/vendor/html5shiv.js': 'app/js/vendor/html5shiv.js' },
        ]
      },
      frontend: {
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
          { 'dist/js/vendor/jquery.min.js': 'app/js/vendor/jquery.js' },<% if (kickstartPackage == 'foundation') { %>
          { 'dist/js/vendor/modernizr.min.js': 'app/js/vendor/custom.modernizr.js' },<% } else { %>
          { 'dist/js/vendor/html5shiv.min.js': 'app/js/vendor/html5shiv.js' },<% } %>
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
        data: 'app/data/*.{json,yml}',
        partials: 'app/html/partials/*.hbs',
        flatten: true,
        layout: 'app/html/layouts/default.hbs'
      },
      development: {
        options: {
          production: false
        },
        files: {
          'dist/html/':'app/html/pages/*.hbs'
        },
      },
      production: {
        options: {
          production: true
        },
        files: {
          'dist/html/':'app/html/pages/*.hbs'
        },
      },
    },

    // Not used presently
    // copy: {
    //   js: {
    //     files : [ { expand: true, flatten: true, src: 'app/js/dist/*', dest: 'dist/js/', filter: 'isFile' } ]
    //   }
    // },

    clean: {
      dist: [ 'dist' ],
      devjs: [ 'dist/js/**/*.js', '!dist/js/**/*.min.js' ],
      devcss: [ 'dist/css/*.css', '!dist/css/*.min.css' ],
      html: [ 'dist/html' ],
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
    if (grunt.watchcontext === 'production') {
      if (target === 'js') {
        grunt.task.run(['concat', 'uglify', 'clean:devjs']);
      }
      else if (target === 'html') {
        grunt.task.run(['assemble:production']);
      } <% if (kickstartPackage == 'bootstrap') { %>
      else if (target === 'less') {
        grunt.task.run(['less', 'cssmin', 'clean:devcss']);
      } <% } else { %>
      else if (target === 'sass') {
        grunt.task.run(['sass', 'cssmin', 'clean:devcss']);
      } <% } %>
    } else {
      if (target === 'js') {
        grunt.task.run(['concat']);
      }
      else if (target === 'html') {
        grunt.task.run(['assemble:development']);
      } <% if (kickstartPackage == 'bootstrap') { %>
      else if (target === 'less') {
        grunt.task.run(['less']);
      } <% } else { %>
      else if (target === 'sass') {
        grunt.task.run(['sass']);
      } <% } %>
    }
  });

  grunt.registerTask('production', [
    'clean:dist',<% if (kickstartPackage == 'bootstrap') { %>
    'less',<% } else { %>
    'sass',<% } %>
    'cssmin',
    'clean:devcss',
    'concat',
    'uglify',
    'clean:devjs',
    'assemble:production'
  ]);

  grunt.registerTask('development', [
    'clean:dist',<% if (kickstartPackage == 'bootstrap') { %>
    'less',<% } else { %>
    'sass',<% } %>
    'concat',
    'assemble:development'
  ]);

  grunt.registerTask('dev', [
    'development'
  ]);

  grunt.registerTask('default', [
    'production'
  ]);

};