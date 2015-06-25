'use strict';

angular.module('pesto.basil', ['ngRoute', 'pesto.settings'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/basil/:id', {
    templateUrl: 'basil/spec.html',
    controller: 'SpecCtrl'
  })
  .when('/new', {
      templateUrl: 'basil/new.html',
      controller: 'NewCtrl'
  })
  ;
}])

.controller('SpecCtrl', ['$log','$http', '$routeParams', '$scope', 'server', 
                         function($log, $http, $routeParams, $scope, server) {
    // Load the list of APIs and display them
    //$log.info('shit we are here!');
    $http.get(server.location + '/' + $routeParams.id + '/spec').success(function(o, status, headers, config){
	
	var spec = {};
	spec.query = o;
	spec.id = $routeParams.id;
	spec.endpoint = headers('X-Basil-Endpoint');
	$log.info('dati',headers());
	$scope.spec = spec;
    });
}])

.controller('NewCtrl', ['$log','$http', '$scope', function($log, $http, $scope){
    // Show the new Api form
}])
;