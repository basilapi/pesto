'use strict';

// Declare app level module which depends on views, and components
angular.module('pesto', [
  'ngRoute',
  'ui.bootstrap',
  'pesto.settings',
  'pesto.collection',
  'pesto.basil',
  'pesto.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/collection'});
}]);

