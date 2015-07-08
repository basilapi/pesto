'use strict';

angular.module('pesto.basil', ['ngRoute', 'pesto.settings'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/basil/:id', {
    templateUrl: 'basil/main.html',
    controller: 'MainCtrl'
  })
  .when('/basil/:id/:tab', {
      templateUrl: 'basil/main.html',
      controller: 'MainCtrl'
  })
  .when('/new', {
    templateUrl: 'basil/new.html',
    controller: 'NewCtrl'
  })
  ;
}])

// Controllers
.controller('MainCtrl', ['$log', '$routeParams', '$scope', '$location', 'server', 
                         function($log, $routeParams, $scope, $location, server) {
    if(!$routeParams.tab){
	$scope.tab = 'spec';
	$scope.variant = false;
    }else{
	var a = $routeParams.tab.split(':');
	$scope.tab = a[0];
	$scope.variant = a[1];
	//$log.info('a:', a)
    }
    
    $scope.id = $routeParams.id;
    $scope.title = $routeParams.id;
    $scope.tabs = [{
	id: 'spec',
        title: 'Specification',
        url: "basil/spec.html"
    }, {
	id: 'docs',
        title: 'Description',
        url: "basil/docs.html"
    }, {
	id: 'views',
        title: 'Scripts',
        url: "basil/views.html"
    }];

    // If tab is addscript
    if($scope.tab == 'addview'){
	$scope.tabs.push({id:"addview", title:"Create a View Script", url: "basil/addview.html"});
    }
    
    //set current tab
    $scope.tabs.forEach(function(i){
	if(i.id == $scope.tab){
	    $scope.currentTab = i.url;
	}
    });
    $scope.onClickTab = function (tab) {
	$location.path('/basil/' + $routeParams.id + '/' + tab.id);
    };
    $scope.isActiveTab = function(tabUrl) {
	return tabUrl == $scope.currentTab;
    };
}])
.controller('SpecCtrl', ['$log','$http', '$routeParams', '$scope', 'server', '$timeout', '$location',
    function($log, $http, $routeParams, $scope, server, $timeout, $location) {
    $scope.editable = ($scope.variant == 'edit');
    
    $scope.save = function(){
	$log.debug('endpoint', $scope.spec.endpoint);
	$log.debug('query', $scope.spec.query);
	$http({
	    method  : 'PUT',
	    url     : server.location + '/' + $scope.spec.id + '/spec',
	    data    : $scope.spec.query,  // pass in data as strings
	    headers : { 'X-Basil-Endpoint': $scope.spec.endpoint }  // set the headers so angular passing info as form data (not request payload)
	   })
	   .success(function(data, status, headers, config) {
	       $location.path('/basil/' + $scope.spec.id + '/spec');
           })
           .error(function(data, status, headers, config) {
               $scope.messages = [{'type':'alert-danger', 'message':headers('X-Basil-Error')}];
	   });
    }
    
    $http.get(server.location + '/' + $routeParams.id + '/spec')
    .success(function(o, status, headers, config){
	var spec = {};
	spec.query = o;
	spec.id = $routeParams.id;
	spec.endpoint = headers('X-Basil-Endpoint');
	$scope.spec = spec;
    });
}])
.controller('DocsCtrl', ['$log','$http', '$routeParams', '$scope', 'server', '$timeout', '$location',
                         function($log, $http, $routeParams, $scope, server, $timeout, $location) {
    $scope.editable = ($scope.variant == 'edit');
    
    $scope.save = function(){
	$http({
	    method  : 'PUT',
	    url     : server.location + '/' + $scope.docs.id + '/docs',
	    data    : $scope.docs.description,  // pass in data as strings
	    headers : { 'X-Basil-Name': $scope.docs.name }  // set the headers so angular passing info as form data (not request payload)
	   })
	   .success(function(data, status, headers, config) {
	       $log.info('success');
	       $location.path('/basil/' + $scope.docs.id + '/docs');
           })
           .error(function(data, status, headers, config) {
               $log.error(status,data);
               $scope.messages = [{'type':'alert-danger', 'message':headers('X-Basil-Error')}];
	   });
    }
    $http.get(server.location + '/' + $routeParams.id + '/docs')
    .success(function(o, status, headers, config){
	var docs = {};
	docs.description = o;
	docs.id = $routeParams.id;
	docs.name = headers('X-Basil-Name');
	$scope.docs = docs;
    });
}])

.controller('ViewsCtrl', ['$log','$http', '$routeParams', '$scope', 'server', '$timeout', '$location', '$anchorScroll',
                         function($log, $http, $routeParams, $scope, server, $timeout, $location, $anchorScroll) {
    
    $scope.id = $routeParams.id;
    $scope.create = function(){
	$location.path('/basil/' + $routeParams.id + '/addview');
    }

    $scope.save = function(view){
	$log.info(view);
    }
    
    $http.get(server.location + '/' + $routeParams.id + '/view')
    .success(function(o, status, headers, config){
	if(!o){
	    $scope.views = [];
	    return;
	}
	var cnt = 0;
	o.forEach(function(i){
	    i.editable = ($scope.variant == i.id);
	    if(i.editable){
		$http.get(server.location + '/' + $routeParams.id + '/view/' + i.id)
		.success(function(d){
		    i.template = d;
		})
		$location.hash('v' + cnt);
	    }
	    cnt++;
	});
	$scope.views = o;
	$timeout(function(){$anchorScroll()}, 1);
    });
    
}])
.controller('AddviewCtrl', ['$log','$http', '$routeParams', '$scope', 'server', '$timeout', '$location', '$anchorScroll',
                          function($log, $http, $routeParams, $scope, server, $timeout, $location, $anchorScroll) {
     
     $scope.view = {extension:'',engine: '',template: '','Content-Type': '', editable: true};
     $scope.save = function(view){
 	$log.info(view);
 	$http({
	    method  : 'PUT',
	    url     : server.location + '/' + $routeParams.id + '/view/' + view.extension,
	    data    : view.template,  // pass in data as strings
	    headers : { 'Content-Type': view.engine, 'X-Basil-Endpoint': $scope.endpoint }  // set the headers so angular passing info as form data (not request payload)
	   })
	   .success(function(data, status, headers, config) {
	       var api = headers('X-Basil-Spec');
	       var apiId = api.replace(/.*?\/([^\/]+)\/spec$/,'$1');
	       $location.path('/basil/' + apiId);
           })
           .error(function(data, status, headers, config) {
               $scope.messages = [{'type':'alert-danger', 'message':headers('X-Basil-Error')}];
	   });
     }
     
 }])
.controller('NewCtrl', ['$log','$http', '$scope', 'server', '$location', function($log, $http, $scope, server, $location){

    $scope.create = function(){
	$log.info($scope.endpoint);
	$log.info($scope.query);
	
	$http({
	    method  : 'PUT',
	    url     : server.location + '/' ,
	    data    : $scope.query,  // pass in data as strings
	    headers : { 'X-Basil-Endpoint': $scope.endpoint }  // set the headers so angular passing info as form data (not request payload)
	   })
	   .success(function(data, status, headers, config) {
	       var api = headers('X-Basil-Spec');
	       var apiId = api.replace(/.*?\/([^\/]+)\/spec$/,'$1');
	       $location.path('/basil/' + apiId);
           })
           .error(function(data, status, headers, config) {
               $scope.messages = [{'type':'alert-danger', 'message':headers('X-Basil-Error')}];
	   });
    }
}])
;