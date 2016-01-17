'use strict';

angular.module('pesto.search', ['ngRoute', 'pesto.settings','pesto.utils'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/search/:text?', {
    templateUrl: 'search/main.html',
    controller: 'SearchCtrl'
  })
  ;
}])

// Controllers

.controller('SearchCtrl', ['$log','$http', '$routeParams', '$scope', 'server', '$timeout', '$location',
    function($log, $http, $routeParams, $scope, server, $timeout, $location) {

    $scope.query = {text: $routeParams.text};
    $scope.search = function(valid){
    	if(valid){
    		$location.path('search/'+$scope.query.text);
    	}
    };
    
    if(!$scope.query.text) return;
    
    $http({
	    method  : 'GET',
	    url     : server.location + '/discovery/search',
	    params    : {query: $scope.query.text},  // pass in data as strings
	    headers : { }  // set the headers
	   })
	   .success(function(data, status, headers, config) {
	       $scope.query = {text: data.query};
	       $scope.count = data.count;
	       $scope.list = data.results;
	       $log.debug('status', status);
	       $log.debug('data', data);
       })
       .error(function(data, status, headers, config) {
           $scope.messages = [{'type':'alert-danger', 'message':headers('X-Basil-Error')}];
       });
}])
.directive('highlight', function($compile, regex) {
    return {link: function(scope,element,attr){
			var text = scope.$parent.$parent.$parent.query.text;
			var tar = text.split(' ');
			var val = eval('scope.'+attr['highlight']);
			val = val .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;").replace(/'/g, "&#039;");
			for(var x in tar){
				var preg = new RegExp('('+regex.escape(tar[x])+')', 'gi');
			    val = val.replace(preg,  '<span class="highlight">$1</span>');
			}
			element.append(val);
	    }
    }
})

;