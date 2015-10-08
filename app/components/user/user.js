'use strict';

angular.module('pesto.user', [
	'pesto.settings',
	'pesto.user.user-directive',
	'pesto.user.interpolate-filter'
])
.factory('user', function(){
   return {username: 'Login', email: '', password: '', isLogged: false};
})
.service('userService', function($log, $http, $q, server, user){

    // public API
    return {
	isLogged: isLogged,
	get: get,
	save: save,
	login: login,
	logout: logout,
	load: info
    };
    
    function isLogged(){
	return user.isLogged;
    }

    function get(){
	return user;
    }
    
    function info(){
        $http({
            method: "get",
            url: server.location + '/auth/me',
            params: {}
        }).success(function(o){
            user.username=o.username;
            user.email=o.email;
            user.isLogged=true;
        }, function(){});
        
        return user;
    }

    function save(){
	// TODO
    }

    function login(u, success, error){
	var request = $http({
	    method: "post",
	    url: server.location + '/auth/login',
	    data: u
	});
	return ( request.then( function(o){
	    user = info();
	    console.log('user', user);
	    if(success){ 
		return success(o); 
	    } else{ 
		return handleSuccess(o);
	    }
	}, error||handleError ) );
    }

    function logout(success, error){
	var request = $http({
	    method: "get",
	    url: server.location + '/auth/logout'
	});
	return ( request.then( function(o){
	    user.username = 'Login';
	    user.email = '';
	    user.isLogged = false;
	    if(success){
		return success(o);
	    }
	    return handleSuccess(o);
	}, error||handleError ) );
    }
    
    function handleError( response ) {
        if (! angular.isObject( response.data ) ||
            ! response.data.message) {
            return( $q.reject( "An unknown error occurred." ) );
        }
        $log.error('An error occurred', response);
        // Otherwise, use expected error message.
        return( $q.reject( response.data.message ) );

    }

    function handleSuccess( response ) {
        return( response.data );
    }

})

.controller('UserCtrl', ['$log','$http', '$scope', '$location', 'server', 'userService', 'user', function($log, $http, $scope, $location, server, userService, user){
    userService.load();
    $scope.user = user;
    $scope.action = function(){
	$scope.user.isLogged ? $location.path('me') : $location.path('login');
    }
    $scope.plus = function(){
	$scope.user.isLogged ? $location.path('new') : $location.path('login');
    }
}]);
;
