'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var _s = require('underscore.string');
var chalk = require('chalk');


var AwesomesauceGenerator = yeoman.generators.NamedBase.extend({
  initializing: function () {
    this.path = '.' + this.env.cwd.replace(process.cwd(), '');
  },

  prompting: function () {
    var done = this.async();



    // Have Yeoman greet the user.
    this.log(yosay(
      'Let\'s create a Sass partial using BEM'
    ));

    var elements = [],
        modifiers = [],
        toModify = [];

    var _this = this;
    var line = '--------',
        separator = '================';

    //////////////////////////////
    // Initial Block Name
    //////////////////////////////
    var blockPrompts = [{
      type: 'string',
      name: 'block',
      message: 'Block Name',
      default: this.args.join(' '),
      validate: function (answer) {
        if (answer === '') {
          return 'You need to name your block!';
        }
        else {
          return true;
        }
      }
    }];

    //////////////////////////////
    // Variable Element Names
    //////////////////////////////
    var elementPrompts = [
      {
        type: 'confirm',
        name: 'elementAdd',
        message: 'Add an Element?',
        default: true
      },
      {
        type: 'string',
        name: 'element',
        message: 'Element Name',
        when: function (answers) {
          return  answers.elementAdd;
        },
        validate: function (answer) {
          if (answer === '') {
            return 'You need to name your element!';
          }
          else if (elements.indexOf(answer) > -1) {
            return 'Element ' + chalk.yellow(answer) + ' already exists!';
          }
          else {
            return true;
          }
        }
      }
    ];

    //////////////////////////////
    // Variable Modifier Names
    //////////////////////////////
    var modifierPrompts = [
      {
        type: 'confirm',
        name: 'modifierAdd',
        message: 'Add an Modifier?',
        default: true
      },
      {
        type: 'string',
        name: 'modifier',
        message: 'Modifier Name',
        when: function (answers) {
          return  answers.modifierAdd;
        },
        validate: function (answer) {
          if (answer === '') {
            return 'You need to name your modifier!';
          }
          else {
            return true;
          }
        }
      }
    ];

    //////////////////////////////
    // Modifier Prompting
    //////////////////////////////
    var addModifier = function () {
      _this.prompt(modifierPrompts, function (props) {
        if (props.modifierAdd) {
          modifiers.push({
            "name": props.modifier,
            "modifies": props.toModify,
          });
          this.log(line);
          addModifier();
        }
        else {
          this.modifiers = modifiers;
          done();
        }
      }.bind(_this));
    }

    //////////////////////////////
    // Element Prompting
    //////////////////////////////
    var addElement = function () {
      _this.prompt(elementPrompts, function (props) {
        if (props.elementAdd) {
          elements.push(props.element);
          this.log(line);
          addElement();
        }
        else {
          this.elements = elements;
          // Dynamic prompts!
          toModify = toModify.concat(elements);

          //////////////////////////////
          // Adds choices
          //////////////////////////////
          modifierPrompts.push({
            type: 'checkbox',
            name: 'toModify',
            message: 'Items to modify',
            choices: toModify,
            when: function (answers) {
              return answers.modifierAdd;
            }
          });

          this.log(separator);
          addModifier();
        }
      }.bind(_this));
    }

    //////////////////////////////
    // Block Prompting
    //////////////////////////////
    this.prompt(blockPrompts, function (props) {
      this.block = props.block;
      this.blockName = _s.titleize(props.block);
      this.blockSlug = _s.slugify(props.block);

      // Add block to list modifiable things
      toModify.push(props.block);

      this.log(separator);
      addElement();
    }.bind(this));
  },

  writing: function () {
    var _this = this;


    var partial = '/**' + '\n' +
      '  *' + ' Partial for `' + this.blockName + '`' + '\n' +
      '**/' + '\n\n';

    // Write initial block
    partial += '// Block `' + _this.block + '`\n';
    partial += '.' + this.blockSlug + ' {\n' + '  \n';

    // Indent and add modifiers, if any
    this.modifiers.forEach(function (m) {
      if (m.modifies.indexOf(_this.block) > -1) {
        partial += '  // Block `' + _this.block + '`, modifier `' + m.name + '`\n';
        partial += '  &--' + _s.slugify(m.name) + ' {\n';
        partial += '    \n';
        partial += '  }\n\n';
      }
    });

    // Indent and add elements, if any
    this.elements.forEach(function (e) {
      partial += '  // Block `' + _this.block + '`, element `' + e + '`\n';
      partial += '  &__' + _s.slugify(e) + ' {\n';
      partial += '    \n';

      // Indent and add modifiers, if any
      _this.modifiers.forEach(function (m) {
        if (m.modifies.indexOf(e) > -1) {
          partial += '    // Block `' + _this.block + '`, element `' + e + '`, modifier `' + m.name + '`\n';
          partial += '    &--' + _s.slugify(m.name) + ' {\n';
          partial += '      \n';
          partial += '    }\n\n';
        }
      });

      partial += '  }\n\n';
    });

    // Close
    partial += '}';

    this.dest.write(this.path + '/_' + this.blockSlug + '.scss', partial);
    // this.log(this.block);
    // this.log(this.elements);
    // this.log(this.modifiers);
    // this.src.copy('somefile.js', 'somefile.js');
  }
});

module.exports = AwesomesauceGenerator;
