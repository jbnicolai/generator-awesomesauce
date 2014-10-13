'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');


var AwesomesauceGenerator = yeoman.generators.Base.extend({
  default: {
    structure: function () {
      var files,
          partials,
          folders,
          base;

      base = 'sass';

      files = [
        'master'
      ]

      partials = [
        'base',
        'states',
        'site-settings',
        'mixins'
      ];

      folders = [
        'layout',
        'module'
      ];

      this.composeWith('sass:structure', {
        options: {
          syntax: 'scss',
          base: base,
          files: files,
          partials: partials,
          folders: folders,
          fileTemplate: this.sourceRoot() + '/_style.scss'
        }
      });
    },

    compass: function () {
      var base,
          gems;

      base = 'sass';

      gems = {
        'sass': '~>3.4',
        'compass': '~>1.0',
        'breakpoint': '~>2.5',
        'singularitygs': '~>1.4',
        'toolkit': '~>2.6',
        'modular-scale': '~>2.0'
      };

      this.composeWith('sass:compass', {
        options: {
          gems: gems,
          httpPath: './',
          cssDir: 'css',
          sassDir: base,
          imagesDir: 'images',
          jsDir: 'js',
          fontsDir: 'fonts',
          outputStyle: ':expanded',
          relativeAssets: true,
          lineComments: false,
          sassOptions: {
            ':sourcemaps': true
          },
          'skip-install': this.options['skip-install']
        }
      });
    }
  }
});

module.exports = AwesomesauceGenerator;
