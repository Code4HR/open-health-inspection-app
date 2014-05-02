angular.module('openHealthDataAppFilters', []).filter('was', function() {
	return function(input) {
		return input ? 'was' : 'wasn\'t';
	}
});