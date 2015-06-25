'use strict';

angular.module('pesto.collection', ['ngRoute', 'pesto.settings'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/collection', {
    templateUrl: 'collection/collection.html',
    controller: 'CollectionCtrl'
  });
}])

.controller('CollectionCtrl', ['$log','$http', '$scope', 'server', function($log, $http, $scope, server) {
    // Load the list of APIs and display them
    
    //$log.info('shit we are here!');
    $http.get(server.location).success(function(o){
	$scope.list = o;
    });
}]);