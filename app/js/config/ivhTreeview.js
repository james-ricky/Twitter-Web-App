'use strict';

/**
 * @ngInject
 */
function IvhTreeview(ivhTreeviewOptionsProvider) {
  ivhTreeviewOptionsProvider.set({
    // idAttribute: 'id',
    // labelAttribute: 'label',
    // childrenAttribute: 'children',
    // selectedAttribute: 'selected',
    useCheckboxes: true,
    // expandToDepth: 0,
    // indeterminateAttribute: '__ivhTreeviewIndeterminate',
    // defaultSelectedState: false,
    // validate: true,
    twistieExpandedTpl: '<i class="ti-angle-down"></i>',
    twistieCollapsedTpl: '<i class="ti-angle-right"></i>',
    twistieLeafTpl: '<i class="ti-control-record"></i>'
  });
}

module.exports = IvhTreeview;
