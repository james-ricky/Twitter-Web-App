'use strict';

/**
 * @ngInject
 */
function UsersSearchesIndexCtrl($rootScope, $scope, Search, SERVICE_EVENTS, UserPackage) {
  var vm = this;

  vm.searches = [];
  vm.package = {};

  var setPackage = function() {
    vm.package = UserPackage.get();
  };

  var setSearches = function() {
    vm.searches = Search.get();
  };

  var deleteSelectedSearch = function(event, options) {
    _.remove(vm.searches, function(search) {
      return search.id === options;
    });
  };

  vm.deleteSearch = function(search) {
    Search.delete(search);
  };

  vm.canCreateSearch = function() {
    if (_.isEmpty(vm.package)) {
      return false;
    } else {
      return (vm.package.package.searchesPerMonth === -1 || vm.package.package.searchesPerMonth > vm.package.usage.searches)
        && (vm.package.package.mentionsPerMonth === -1 || vm.package.package.mentionsPerMonth > vm.package.usage.mentions);
    }
  };

  Search.reload();
  UserPackage.reload();

  $scope.$on(SERVICE_EVENTS.getPackageDetail, setPackage );

  $scope.$on(SERVICE_EVENTS.searchDeleted, deleteSelectedSearch);
  $scope.$on(SERVICE_EVENTS.searchesUpdated, setSearches);
}

module.exports = UsersSearchesIndexCtrl;
