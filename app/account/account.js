'use strict';

angular.module('pesto.account', ['ngRoute', 'pesto.settings'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/me', {
    templateUrl: 'account/account.html',
    controller: 'AccountCtrl'
  })
  .when('/me:edit', {
    templateUrl: 'account/account.html',
    controller: 'AccountCtrl'
  })
  .when('/login', {
      templateUrl: 'account/login.html',
      controller: 'LoginCtrl'
  })
  .when('/logout', {
    templateUrl: 'account/logout.html',
    controller: 'LogoutCtrl'
  })
  ;
}])

// Controllers
.controller('AccountCtrl', ['$log', '$routeParams', '$scope', '$location', 'server', 'userService',
   function($log, $routeParams, $scope, $location, server, userService) {
      $scope.user = userService.get();
      // If not logged, move to login
      if(!$scope.user.isLogged){
	  $location.path('login');
      }
      $scope.logout = function(){
	  userService.logout(function(){
	      $location.path('');
	  });
      }
      //
      $scope.editable = false;
      
}])
.controller('LoginCtrl', ['$log', '$routeParams', '$scope', '$location', 'server', 'userService', 
   function($log, $routeParams, $scope, $location, server, userService) {
    if(userService.get().isLogged) {
	$location.path('me'); return;
    }
    $scope.user = {username:'', password: ''};
    $scope.login = function(user){
	userService.login(user,function(){
	   $location.path(''); 
	});
    }
}])
;