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
  .when('/clone/:id', {
    templateUrl: 'basil/clone.html',
    controller: 'CloneCtrl'
  })
  ;
}])

// Controllers
.controller('MainCtrl', ['$log', '$routeParams', '$scope', '$location', 'server', 'user',
                         function($log, $routeParams, $scope, $location, server, user) {
    if(!$routeParams.tab){
	$scope.tab = 'spec';
	$scope.variant = false;
    }else{
	var a = $routeParams.tab.split(':');
	$scope.tab = a[0];
	$scope.variant = a[1];
	//$log.info('a:', a)
    }
    $scope.user = user;
    $scope.api = {};
    $scope.api.id = $routeParams.id;
    $scope.api.title = $routeParams.id;
    $scope.api.createdBy = ''; // XXX we update this from the child scope...
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
    
    $scope.save = function(valid){
	if(!valid){
	    return;
	}
//	$log.debug('endpoint', $scope.spec.endpoint);
//	$log.debug('query', $scope.spec.query);
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
	spec.createdBy = headers('X-Basil-Creator');
	$scope.api.swagger = headers('X-Basil-Swagger');
	$scope.api.createdBy = spec.createdBy;
	$scope.api.title = headers('X-Basil-Name') || $scope.api.title;
	$scope.spec = spec;
	
	$scope.editable = ($scope.variant == 'edit' && $scope.user.username == $scope.api.createdBy);
    });
}])
.controller('DocsCtrl', ['$log','$http', '$routeParams', '$scope', 'server', '$timeout', '$location',
                         function($log, $http, $routeParams, $scope, server, $timeout, $location) {
    
    $scope.save = function(valid){
	if(!valid) return;
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
	$scope.api.swagger = headers('X-Basil-Swagger');
	docs.createdBy = $scope.api.createdBy = headers('X-Basil-Creator');
	$scope.docs = docs;
	$scope.api.title = docs.name;
	$scope.editable = ($scope.variant == 'edit' && $scope.user.username == $scope.api.createdBy);
    });
}])

.controller('ViewsCtrl', ['$log','$http', '$routeParams', '$scope', 'server', '$timeout', '$location', '$anchorScroll',
                         function($log, $http, $routeParams, $scope, server, $timeout, $location, $anchorScroll) {
    
    $scope.id = $routeParams.id;
    $scope.create = function(){
	$location.path('/basil/' + $routeParams.id + '/addview');
    }

    $scope.save = function(view){
	$log.debug(view);
	
 	$http({
	    method  : 'PUT',
	    url     : server.location + '/' + $routeParams.id + '/view/' + view.extension + '?type=' + view.type,
	    data    : view.template,  // pass in data as strings
	    headers : { 'Content-Type': view['content-type'] }  // set the headers so angular passing info as form data (not request payload)
	   })
	   .success(function(data, status, headers, config) {
	       $log.debug("created",view);
	       if(view.id != view.extension){
		   $scope.del(view);
		   return;
	       }
	       var api = headers('X-Basil-Spec');
	       var apiId = api.replace(/.*?\/([^\/]+)\/spec$/,'$1');
	       $location.path('/basil/' + apiId + '/views');
           })
           .error(function(data, status, headers, config) {
               $scope.messages = [{'type':'alert-danger', 'message':headers('X-Basil-Error')}];
	   });
    }

    $scope.del = function(view){
	$log.debug(view);
 	$http({ method : 'DELETE' , url : server.location + '/' + $routeParams.id + '/view/' + view.id})
	   .success(function(data, status, headers, config) {
	       var api = headers('X-Basil-Spec');
	       var apiId = api.replace(/.*?\/([^\/]+)\/spec$/,'$1');
	       $location.path('/basil/' + apiId + '/views');
           })
           .error(function(data, status, headers, config) {
               $scope.messages = [{'type':'alert-danger', 'message':headers('X-Basil-Error')}];
	   });
    }
    
    $http.get(server.location + '/' + $routeParams.id + '/view')
    .success(function(o, status, headers, config){
	$scope.api.createdBy = headers('X-Basil-Creator');
	$scope.api.swagger = headers('X-Basil-Swagger');
	$scope.api.title = headers('X-Basil-Name') || $routeParams.id ;
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
.controller('AddviewCtrl', ['$log','$http', '$routeParams', '$scope', 'server', '$timeout', '$location', '$anchorScroll', 'user',
                          function($log, $http, $routeParams, $scope, server, $timeout, $location, $anchorScroll, user) {
    $scope.api.id = $routeParams.id;
    $scope.api.title = headers('X-Basil-Name') || $routeParams.id;
    $scope.api.swagger = server.location + '/' + $routeParams.id + '/api-docs';
     $scope.user = user;
     $scope.view = {extension:'','content-type': '',template: '', type: '', editable: true}; // TODO Check acl
     $scope.save = function(view){
 	$log.debug(view);
 	$http({
	    method  : 'PUT',
	    url     : server.location + '/' + $routeParams.id + '/view/' + view.extension,
	    data    : view.template,  // pass in data as strings
	    headers : { 'Content-Type': view['content-type'] }  // set the headers so angular passing info as form data (not request payload)
	   })
	   .success(function(data, status, headers, config) {
	       var api = headers('X-Basil-Spec');
	       var apiId = api.replace(/.*?\/([^\/]+)\/spec$/,'$1');
	       $location.path('/basil/' + apiId + '/views');
           })
           .error(function(data, status, headers, config) {
               $scope.messages = [{'type':'alert-danger', 'message':headers('X-Basil-Error')}];
	   });
     }
     
 }])
 .controller('NewCtrl', ['$log','$http', '$scope', 'server', '$location', 'user', function($log, $http, $scope, server, $location, user){

     // if user is not logged in, redirect to login
     if(!user.isLogged){
 	$location.path('/login');
 	return;
     }
     $scope.create = function(valid){
 	if(!valid) return;
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
 .controller('CloneCtrl', ['$log','$http', '$scope', 'server', '$location', 'user', '$routeParams', function($log, $http, $scope, server, $location, user, $routeParams){
     $scope.api = {};
     $scope.api.id = $routeParams.id;
    
     // if user is not logged in, redirect to login
     if(!user.isLogged){
 	$location.path('/login');
 	return;
     }
     
     $scope.undo = function(valid){
	 $location.path('/basil/'+$routeParams.id)
     };
     $scope.clone = function(){
 	$http({
 	    method  : 'GET',
 	    url     : server.location + '/' + $routeParams.id + "/clone"
 	   })
 	   .success(function(data, status, headers, config) {
 	       var api = headers('X-Basil-Spec');
 	       var apiId = api.replace(/.*?\/([^\/]+)\/spec$/,'$1');
 	       $location.path('/basil/' + apiId);
            });
     }
 }])
;