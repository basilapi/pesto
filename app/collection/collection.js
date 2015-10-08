'use strict';

angular.module('pesto.collection', ['ngRoute', 'pesto.settings','pesto.utils'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/collection', {
    templateUrl: 'collection/collection.html',
    controller: 'CollectionCtrl'
  });
}])

.controller('CollectionCtrl', ['$log','$http', '$scope', 'server', 'user', function($log, $http, $scope, server, user) {
    // Load the list of APIs and display them
    $scope.user = user;
    //$log.info('shit we are here!');
    $http.get(server.location).success(function(o){
	$scope.list = o;
    });
}]);