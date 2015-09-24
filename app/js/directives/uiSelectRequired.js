'use strict'

var angular = require('angular');

function uiSelectRequired() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.uiSelectRequired = function(modelValue, viewValue) {

        var determineVal;
        if (angular.isArray(modelValue)) {
          determineVal = modelValue;
        } else if (angular.isArray(viewValue)) {
          determineVal = viewValue;
        } else {
          return false;
        }

        return determineVal.length > 0;
      };
    }
  };
}

module.exports = uiSelectRequired;
