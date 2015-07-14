'use strict';

angular.module('pesto.account', ['ngRoute', 'pesto.settings','pesto.validators'])

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
  .when('/signup', {
      templateUrl: 'account/signup.html',
      controller: 'SignupCtrl'
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
.controller('SignupCtrl', ['$log', '$http', '$routeParams', '$scope', '$location', 'server', 'userService', 'user',
    function($log, $http, $routeParams, $scope, $location, server, userService, user) {
       $scope.user = {};
       // If logged, move to me
       if(user.isLogged){
 	  $location.path('me');
 	  return;
       }
       $scope.signup = function(user, valid){
	   console.log('called sign up');
	   if(!valid) return;
	   $http({
		    method  : 'POST',
		    url     : server.location + '/users',
		    data    : $scope.user,  // pass in data as strings
		   })
		   .success(function(data, status, headers, config) {
		       $log.info('success');
		       $location.path('me');
	           })
	           .error(function(data, status, headers, config) {
	               $log.error(status,data);
	               $scope.messages = [{'type':'alert-danger', 'message':headers('X-Basil-Error')}];
		   });
       }
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