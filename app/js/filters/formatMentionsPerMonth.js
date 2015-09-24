'use strict';

/**
 * @ngInject
 */
function FormatMentionsPerMonth($filter, $translate) {
  return function(input) {
    if (input === -1) {
      return $translate.instant('public.registrations.field.unlimited')
    } else {
      return $translate.instant('public.registrations.field.upTo') + $filter('number')(input);
    }
  };
}

module.exports = FormatMentionsPerMonth;
