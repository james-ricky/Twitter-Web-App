'use strict';

/**
 * @ngInject
 */
function FormatSearchesPerMonth($filter, $translate) {
  return function(input) {
    if (input === -1) {
      return "Unlimited"
    } else {
      // return "Up to " + $filter('number')(input) + " live search";
      return $filter('number')(input) + $translate.instant('public.registrations.field.liveSearch');
    }
  };
}

module.exports = FormatSearchesPerMonth;
