'use strict';

/**
 * @ngInject
 */
function FormatTopupMentionsPerMonth($filter, $translate) {
  return function(input) {
    if (input === -1) {
      return $translate.instant('public.registrations.field.unlimited')
    } else {
      return $filter('number')(input) ;
    }
  };
}

module.exports = FormatTopupMentionsPerMonth;
