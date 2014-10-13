'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var _s = require('underscore.string');
var sh = require('execSync');

var AwesomesauceGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  // Powered by https://www.npmjs.org/package/inquirer
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the neat Awesomesauce generator!'
    ));

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

  configuring: function () {
    if (!this.options['init']) {
      this.destinationRoot(this.projectSlug);
    }
  },

  default: function () {
    this.composeWith('awesomesauce:sass', {
      options: {
        'skip-install': this.options['skip-install']
      }
    });
  },

  writing: {
    app: function () {
      this.dest.mkdir('app');
      this.dest.mkdir('app/templates');

      this.template('_package.json', 'package.json');
      this.template('_bower.json', 'bower.json');
    },

    projectfiles: function () {
      this.src.copy('editorconfig', '.editorconfig');
      this.src.copy('jshintrc', '.jshintrc');
    }
  },

  install: function () {
    if (!this.options['skip-install']) {
      this.installDependencies();
    }
  },

  end: function () {
    this.log('\n  Contents of ' + chalk.cyan('package.json'));
    sh.run('cat package.json');
  }
});

module.exports = AwesomesauceGenerator;
