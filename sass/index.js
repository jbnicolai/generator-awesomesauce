'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');


var AwesomesauceGenerator = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    var partialPrompts = [{
      type: 'list',
      name: 'partials',
      message: 'What Sass partial structure would you like to use?',
      choices: ['Atomic', 'North', 'SMACSS']
    }];

    this.prompt(partialPrompts, function (props) {
      this.partials = props.partials.toLowerCase();

      done();
    }.bind(this));
  },

  default: function () {
    if (this.partials === 'atomic') {
      this.composeWith('style-prototype:atomic', {
        options: {
          'skip-install': this.options['skip-install']
        }
      });
    }
    else if (this.partials === 'north') {
      this.composeWith('north:sass', {
        options: {
          'skip-install': this.options['skip-install']
        }
      });
    }
    else if (this.partials === 'smacss') {
      this.composeWith('awesomesauce:smacss', {
        options: {
          'skip-install': this.options['skip-install']
        }
      });
    }
  }
});

module.exports = AwesomesauceGenerator;
