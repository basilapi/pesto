'use strict';

// Declare app level module which depends on views, and components
angular.module('pesto', [
  'ngRoute',
  'ui.bootstrap',
  'pesto.settings',
  'pesto.collection',
  'pesto.basil',
  'pesto.version',
  'pesto.user',
  'pesto.account'
]).
config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
  $routeProvider.otherwise({redirectTo: '/collection'});
  $httpProvider.defaults.withCredentials = true;
}]);

