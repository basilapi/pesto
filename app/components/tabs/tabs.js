'use strict';

angular.module('pesto.tabs', [])

.directive('showTab', function(){
    return {
	link: function (scope, element, attrs){
//	    console.log('element', element);
	    element.on('click', function(e){
//		console.log('shit', e);
		e.preventDefault();
		$(element).tab('show');
	    });
	}
    };
});