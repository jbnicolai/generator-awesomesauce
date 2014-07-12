'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var _s = require('underscore.string');
var sh = require('execSync');


var AwesomesauceGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies({
          callback: function () {
            console.log('\n  Contents of ' + chalk.cyan('package.json'));
            sh.run('cat package.json');
          }
        });
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the marvelous Awesomesauce generator!'));

    var prompts = [{
      type: 'confirm',
      name: 'someOption',
      message: 'Would you like to enable this option?',
      default: true
    }];

    prompts.unshift({
      type: 'string',
      name: 'projectName',
      message: 'What\'s your project\'s name?' + chalk.red(' (Required)'),
      validate: function (input) {
        if (input === '') {
          return 'Please enter your project\'s name';
        }
        else {
          return true;
        }
      }
    });

    this.prompt(prompts, function (props) {
      this.someOption = props.someOption;
      this.projectName = props.projectName;
      this.projectSlug = _s.slugify(props.projectName);

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('app');
    this.mkdir('app/templates');

    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = AwesomesauceGenerator;
