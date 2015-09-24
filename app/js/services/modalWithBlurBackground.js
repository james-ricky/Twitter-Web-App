'use strict';

/**
 * @ngInject
 */
function ModalWithBlurBackground($modal) {

  var service = {};

  service.open = function(options) {
    var modalInstance = $modal.open(options);
    modalInstance.opened.then(function() {
      $('.ui-view-container').addClass('blur');
    });
    modalInstance.result.then(function() {
      }, function () {
        $('.ui-view-container').removeClass('blur');
      }
    );
  };

  return service;

}

module.exports = ModalWithBlurBackground;
