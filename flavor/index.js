'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var _s = require('underscore.string');
var chalk = require('chalk');
var fs = require('fs-extra');


var FlavorGenerator = yeoman.generators.NamedBase.extend({
  askFor: function () {
    var done = this.async();

    var sizes = [];
    var _this = this;
    var line = '--------';

    var name = [{
      type: 'string',
      name: 'flavorName',
      message: 'Flavor Name',
      default: this.args.join(' '),
      validate: function (answer) {
        if (answer === '') {
          return 'You need to name your flavor!';
        }
        else {
          return true;
        }
      }
    }];

    var sizePrompts = [
      {
        type: 'confirm',
        name: 'sizeAdd',
        message: 'Add a size?',
        default: true
      },
      {
        type: 'list',
        name: 'sizeSize',
        message: 'What size would you like?',
        choices: ['Small', 'Medium', 'Large', 'Extra Large'],
        default: 'Small',
        when: function (answers) {
          return  answers.sizeAdd;
        }
      },
      {
        type: 'string',
        name: 'sizeName',
        message: 'Size name' + chalk.red(' (Required)'),
        validate: function (answer) {
          if (answer === '') {
            return 'You need to name your size!';
          }
          else {
            return true;
          }
        },
        when: function (answers) {
          return answers.sizeAdd;
        }
      }
    ];

    var addSize = function () {
      _this.prompt(sizePrompts, function (props) {
        if (props.sizeAdd) {
          sizes.push({
            "name": props.sizeName,
            "size": props.sizeSize
          });
          console.log(line);
          addSize();
        }
        else {
          this.flavorSizes = sizes;
          done();
        }
      }.bind(_this));
    }

    this.prompt(name, function (props) {
      this.flavorName = _s.titleize(props.flavorName);
      this.flavorSlug = _s.slugify(props.flavorName);

      addSize();
    }.bind(this));
  },

  files: function () {

    var _this = this;
    var path = './json/' + _this.flavorSlug + '.json';

    fs.outputJSON(path, {
      "name": _this.flavorName,
      "sizes": _this.flavorSizes
    }, function (err) {
      if (err) {
        console.log(chalk.red(err));
      }
      else {
        console.log('  ' + chalk.green('create ') + path);
      }
    });

    fs.readFile('./json/.files', function (err, data) {
      if (err) {

        fs.outputFile('./json/.files', _this.flavorName, function (err2) {
          if (err) {
            console.log(chalk.red(err2));
          }
        });
      }
      else {
        data = data.toString();
        data += '\n' + _this.flavorName;

        fs.outputFile('./json/.files', data, function (err2) {
          if (err) {
            console.log(chalk.red(err2));
          }
        });
      }
    })


  }
});

module.exports = FlavorGenerator;
