'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  var welcome =
  '\n     _-----_' +
  '\n    |       |' +
  '\n    |' + '--(o)--'.red + '|   .--------------------------.' +
  '\n   `---------´  |    ' + 'Welcome to Yeoman,'.yellow.bold + '    |' +
  '\n    ' + '( '.yellow + '_' + '´U`'.yellow + '_' + ' )'.yellow + '   |   ' + 'ladies and gentlemen!'.yellow.bold + '  |' +
  '\n    /___A___\\   \'__________________________\'' +
  '\n     |  ~  |'.yellow +
  '\n   __' + '\'.___.\''.yellow + '__' +
  '\n ´   ' + '`  |'.red + '° ' + '´ Y'.red + ' `\n';

  console.log(welcome);

  var prompts = [
    {
      name: 'kickstartPackage',
      message: 'What package would you like to use [foundation, bootstrap]',
      default: 'foundation'
    }
  ];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }
    this.kickstartPackage = props.kickstartPackage;
    cb();
  }.bind(this));
};

Generator.prototype.app = function app() {
  this.mkdir('app');
  this.copy('package.json', 'package.json');
};

Generator.prototype.foundationFiles = function foundationFiles() {
  if (this.kickstartPackage != 'foundation') return;
  this.directory('foundation', 'app');
};

Generator.prototype.bootstrapFiles = function bootstrapFiles() {
  if (this.kickstartPackage != 'bootstrap') return;
  this.directory('bootstrap', 'app');
};

Generator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

Generator.prototype.projectfiles = function projectfiles() {
  this.copy('README.md', 'README.md');
  this.copy('_editorconfig', '.editorconfig');
  this.copy('_jshintrc', '.jshintrc');
};
