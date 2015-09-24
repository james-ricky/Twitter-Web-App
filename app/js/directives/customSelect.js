'use strict';

/**
 * @ngInject
 */
function CustomSelect($compile) {
  return {
    require: 'ngModel',
    restrict: 'E',
    scope: true,
    compile: function(tElem, tAttrs, transclude) {
      return function(scope, iElem, iAttrs, ngModel) {
        var collectionName, disabledAttribute, disabledClass, expandedClass, labelExpression, ngModelName, ngOptionParts, ngOptions, objectExpression, optionClass, optionScopes, optionValueWrapperClass, placeholderClass, placeholderLabel, removeElementsAndOptionScopes, selectClass, valueName, tabindex;
        selectClass = iAttrs.selectClass || 'custom-select';
        optionClass = iAttrs.optionClass || 'option';
        optionValueWrapperClass = iAttrs.optionValueWrapperClass || 'value';
        expandedClass = iAttrs.expandedClass || 'expanded';
        placeholderClass = iAttrs.placeholderClass || 'placeholder';
        placeholderLabel = iAttrs.placeholder || 'Select a value...';
        disabledAttribute = iAttrs.disabledAttribute || null;
        disabledClass = iAttrs.disabledClass || 'disabled';
        ngModelName = iAttrs.ngModel;
        ngOptions = iAttrs.ngOptions.trim();
        tabindex = iAttrs.ngTabindex;
        ngOptionParts = ngOptions.match(/^\s*([\w.]*)\s*(as)?\s*([\w.]*)\s*(for)\s*([\w.]*)\s*(in)\s*(\w.*)/);
        objectExpression = ngOptionParts[1];
        labelExpression = ngOptionParts[3] || objectExpression;
        valueName = ngOptionParts[5];
        collectionName = ngOptionParts[7];
        scope.expanded = false;

        scope.onOutsideClick = function(evt) {
          scope.expanded = false;
          return scope.$apply();
        };
        scope.onKeydown = function($event) {
          if ($event.keyCode === 32) {
            scope.onPlaceholderClick($event);
          }
          return;
        };
        scope.onPlaceholderClick = function($event) {
          $event.stopPropagation();
          return scope.expanded = !scope.expanded;
        };
        scope.onItemClick = function(item, $event) {
          $event.stopPropagation();
          if (disabledAttribute && item[disabledAttribute]) {
            return;
          }
          ngModel.$setViewValue(item);
          return scope.expanded = false;
        };
        scope.formatItemValue = function(item) {
          var firstDotIndex;
          if (!item) {
            return null;
          }
          firstDotIndex = labelExpression.indexOf('.');
          if (firstDotIndex === -1) {
            return item;
          }
          return item[labelExpression.substr(firstDotIndex + 1)];
        };
        optionScopes = [];
        removeElementsAndOptionScopes = function() {
          var optionScope, _i, _len;
          if (optionScopes.length) {
            for (_i = 0, _len = optionScopes.length; _i < _len; _i++) {
              optionScope = optionScopes[_i];
              optionScope.$destroy();
            }
            optionScopes = [];
          }
          return iElem.empty();
        };
        scope.$watchCollection(collectionName, function(collection) {
          var compiledOptionHTML, compiledSelectHTML, i, item, optionHTML, optionScope, selectHTML, _i, _len, _results;
          removeElementsAndOptionScopes();
          selectHTML = "<div class='" + selectClass + "'";
          selectHTML += " ng-class='{ \"" + expandedClass + "\": expanded }'>";
          selectHTML += "</div>";
          compiledSelectHTML = $compile(selectHTML)(scope);
          iElem.append(compiledSelectHTML);
          optionHTML = "<div class='" + placeholderClass + " " + optionClass + "'";
          optionHTML += " ng-mousedown='onPlaceholderClick($event)' ng-keydown='onKeydown($event)' tabindex='" + tabindex + "'>";
          optionHTML += "<span class='" + optionValueWrapperClass + "'>";
          optionHTML += "{{ formatItemValue(" + ngModelName + ") || '" + placeholderLabel + "' }}";
          optionHTML += "</span>";
          optionHTML += "</div>";
          optionScope = scope.$new();
          compiledOptionHTML = $compile(optionHTML)(optionScope);
          compiledSelectHTML.append(compiledOptionHTML);
          optionScopes.push(optionScope);
          _results = [];
          for (i = _i = 0, _len = collection.length; _i < _len; i = ++_i) {
            item = collection[i];
            optionHTML = "<div class='" + optionClass + "'";
            if (disabledAttribute && disabledClass) {
              optionHTML += " ng-class='{ \"" + disabledClass + "\": " + objectExpression + "." + disabledAttribute + " }'";
            }
            optionHTML += " ng-mousedown='onItemClick(" + objectExpression + ", $event)'>";
            optionHTML += "<span class='" + optionValueWrapperClass + "'>";
            optionHTML += "{{ " + labelExpression + " }}";
            optionHTML += "</span>";
            optionHTML += "</div>";
            optionScope = scope.$new();
            optionScope[valueName] = item;
            compiledOptionHTML = $compile(optionHTML)(optionScope);
            compiledSelectHTML.append(compiledOptionHTML);
            _results.push(optionScopes.push(optionScope));
          }
          return _results;
        });
        document.body.addEventListener('mousedown', scope.onOutsideClick);
        return scope.$on('$destroy', function() {
          document.body.removeEventListener('mousedown', scope.onOutsideClick);
          return removeElementsAndOptionScopes();
        });

      };
    }
  };
};

module.exports = CustomSelect;
