'use strict';

angular.module('pesto.user.interpolate-filter', [])

.filter('interpolate', ['user', function(user) {
  return function(text) {
    return String(text).replace(/\%USER\%/mg, user);
  };
}]);
