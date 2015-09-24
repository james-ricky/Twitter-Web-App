'use strict';

/**
 * @ngInject
 */
function Translate($translateProvider) {
  $translateProvider.translations('en-US', require('../locales/en-US'));
  $translateProvider.translations('zh-TW', require('../locales/zh-TW'));

  $translateProvider.preferredLanguage('en-US');
}

module.exports = Translate;
