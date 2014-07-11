angular.module('openHealthDataAppFilters', [])
  .filter('was', function() {
  	return function(input) {
  		return input ? 'was' : 'wasn\'t';
  	}
  })
  .filter('categoryIcon', function(){
    return function(input) {
      switch (input) {
        case "Education":
          return "fa fa-graduation-cap";
        case "Hospitality":
          return "fa fa-building";
        case "Restaurant":
          return "fa fa-cutlery";
        case "Grocery":
          return "fa fa-shopping-cart";
        case "Government":
          return "fa fa-university";
        case "Medical":
          return "fa fa-plus-square";
        case "Mobile Food":
          return "fa fa-truck";
        case "Other":
          return "fa fa-spoon";
        default:
          return "fa fa-cutlery";
      }
    };
  });