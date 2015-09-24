'use strict';

/**
 * @ngInject
 */
function FirstTimeWalkthrough($log, $q, Me, Restangular) {

  var service = {};

  service.complete = function (data) {
    var promise = Restangular.all('users').one("first_time_walkthrough").one("complete").customPUT();

    promise.then(function (result) {

      $log.debug("ok updating me first_time_walkthrough_completed", result);

      Me.reload();

    }, function (result) {

      $log.error("error updating me first_time_walkthrough_completed", result);

    });

    return promise;
  };

  return service;

}

module.exports = FirstTimeWalkthrough;
