'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var fs = require('fs-extra');
var chalk = require('chalk');
var _s = require('underscore.string');
var validator = require('validator');

var PriceGenerator = yeoman.generators.Base.extend({
  init: function () {
    var done = this.async();
    var _this = this;

    fs.readFile('./json/.files', function (err, data) {
      if (err) {
        console.log(chalk.red(err));
        done();
      }
      else {
        _this.flavors = data.toString().split('\n');
        done();
      }
    });

  },

  askFor: function () {
    var done = this.async();
    var _this = this;
    var pricePrompt = [];

    var flavorPrompt = [
      {
        type: 'list',
        name: 'flavor',
        message: 'What flavor would you like to add prices to?',
        choices: _this.flavors
      }
    ]

    this.prompt(flavorPrompt, function (props) {
      this.flavorName = props.flavor;
      this.flavorSlug = _s.slugify(props.flavor);

      fs.readJSON('./json/' + this.flavorSlug + '.json', function (err, data) {
        _this.file = data;

        if (err) {
          console.log(chalk.red(err));
        }
        else {
          var sizes = data.sizes;
          if (sizes.length === 0) {
            console.log(chalk.red('There are no sizes for ' + _this.flavorName));
            done();
          }
          else {
            sizes.forEach(function (value, key, array) {
              pricePrompt.push({
                type: 'string',
                name: value.name,
                message: 'What price would you like for ' + chalk.cyan(value.name) + ' (' + chalk.magenta(value.size) + ') in USD',
                validate: function (answer) {
                  if (answer === '') {
                    return 'You need to set a price!'
                  }
                  else if (!validator.isFloat(answer)) {
                    return 'Price needs to be a number. Do not include currency symbol.';
                  }
                  else {
                    return true;
                  }
                }
              })
            });

            _this.prompt(pricePrompt, function (props2) {
              _this.prices = props2;

              done();
            }.bind(_this));
          }
        }
      })
    }.bind(this));
  },

  process: function () {
    var _this = this;
    var path = './json/' + _this.flavorSlug + '.json';

    var output = {
      "name": _this.file.name,
      "sizes": []
    };

    _this.file.sizes.forEach(function (value, key, array) {
      var price = _this.prices[value.name];
      value.price = price;
      output.sizes.push(value);
    });

    fs.outputJSON(path, output, function (err) {
      if (err) {
        console.log(chalk.red(err));
      }
      else {
        console.log('  ' + chalk.green('update ') + path);
      }
    });
  }
});

module.exports = PriceGenerator;
