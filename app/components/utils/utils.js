'use strict';

angular.module('pesto.utils', [
])
.directive('timeDiff', function() {
    var timeDiff =  function(current, previous) {

	    var msPerMinute = 60 * 1000;
	    var msPerHour = msPerMinute * 60;
	    var msPerDay = msPerHour * 24;
	    var msPerMonth = msPerDay * 30;
	    var msPerYear = msPerDay * 365;

	    var elapsed = current - previous;

	    if (elapsed < msPerMinute) {
	         return Math.round(elapsed/1000) + ' seconds ago';   
	    }

	    else if (elapsed < msPerHour) {
	         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
	    }

	    else if (elapsed < msPerDay ) {
	         return Math.round(elapsed/msPerHour ) + ' hours ago';   
	    }

	    else if (elapsed < msPerMonth) {
	        return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';   
	    }

	    else if (elapsed < msPerYear) {
	        return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';   
	    }

	    else {
	        return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';   
	    }
	};
    return {link: function(scope,element,attr){
	var val = eval('scope.' + attr['timeDiff']);
	element.append(timeDiff(Date.now(),val));
    }}
})
// Utilities for regular expressions
.service('regex', function(){
	// XXX See http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
	  //
	  // Referring to the table here:
	  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/regexp
	  // these characters should be escaped
	  // \ ^ $ * + ? . ( ) | { } [ ]
	  // These characters only have special meaning inside of brackets
	  // they do not need to be escaped, but they MAY be escaped
	  // without any adverse effects (to the best of my knowledge and casual testing)
	  // : ! , = 
	  // my test "~!@#$%^&*(){}[]`/=?+\|-_;:'\",<.>".match(/[\#]/g)

	  var specials = [
	        // order matters for these
	          "-"
	        , "["
	        , "]"
	        // order doesn't matter for any of these
	        , "/"
	        , "{"
	        , "}"
	        , "("
	        , ")"
	        , "*"
	        , "+"
	        , "?"
	        , "."
	        , "\\"
	        , "^"
	        , "$"
	        , "|"
	      ]

	      // I choose to escape every character with '\'
	      // even though only some strictly require it when inside of []
	    , regex = RegExp('[' + specials.join('\\') + ']', 'g')
	    ;

	return {
		escape: function (str) {
		    return str.replace(regex, "\\$&");
		}
	};
})
;

