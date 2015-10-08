'use strict';

angular.module('pesto.error', [ 'ngRoute', 'pesto.settings', 'pesto.utils' ])
	.factory('httpErrorInterceptor', function($q, $rootScope, $log) {
	    $rootScope.messages = $rootScope.messages || {
		danger : {},
		warning : {},
		success : {},
		info : {}
	    };

	    function message(id, type, text) {
		$rootScope.messages[type][id] = {
		    id : id,
		    type : type,
		    text : text
		};
	    }
	    ;
	    function serverUnreachable(rejection) {
		message('serverUnreachable', 'danger', 'Server unreachable');
		$log.error('serverUnreachable', $rootScope);
	    }
	    ;
	    function serverFault(rejection) {
		message('serverUnreachable', 'danger', 'Server fault: ' + rejection.statusText);
		$log.error('serverFault', $rootScope);
	    }
	    ;
	    function basilError(text) {
		message('basilError', 'warning', text);
		$log.error('serverUnreachable', $rootScope);
	    }
	    ;
	    return {
		// optional method
		'request' : function(config) {
		    // do something on success
		    return config;
		},

		// optional method
		'requestError' : function(rejection) {
		    // do something on error?
		    return $q.reject(rejection);
		},

		// optional method
		'response' : function(response) {
		    // do something on success
		    // Remove basil failure messages
		    angular.element(
				document.querySelector("#basilError"))
				.remove();
		    return response;
		},

		// optional method
		'responseError' : function(rejection) {

		    // If we have an error message from Basil
		    $log.error(rejection);
		    // do something on error
		    if (rejection.status == -1) {
			serverUnreachable();
		    } else if (rejection.status == 403) {
			// Ignore for the moment
		    } else if (rejection.data && rejection.data.error) {
			basilError(rejection.data.error);
		    } else {
			serverFault(rejection);
		    }
		    return $q.reject(rejection);
		}
	    };
	}).config([ '$httpProvider', function($httpProvider) {
	    $httpProvider.interceptors.push('httpErrorInterceptor');
	} ]).controller(
		'MessageCtrl',
		[
			'$log',
			'$http',
			'$scope',
			'server',
			'user',
			function($log, $http, $scope, server, user) {
			    $scope.remove = function(o, x, y) {
				angular.element(
					document.querySelector('#' + o.id))
					.remove();
			    }
			} ]);
