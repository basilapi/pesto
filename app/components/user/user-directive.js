'use strict';

angular.module('pesto.user.user-directive', [])

.directive('appUser', ['user', function(user) {
  return function(scope, elm, attrs) {
    elm.text(user);
  };
}]);
