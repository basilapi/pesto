'use strict';
// FIXME TO BE DELETED
angular.module('pesto.tabs', [])

.directive('showTab', function(){
    return {
	link: function (scope, element, attrs){
	    element.on('click', function(e){
		e.preventDefault();
		$(element).tab('show');
	    });
	}
    };
});