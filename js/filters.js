angular.module('openHealthDataAppFilters', [])
  .filter('was', function() {
  	return function(input) {
  		return input ? 'was' : 'wasn\'t';
  	}
  })
  .filter('category', function(){
    return function(input) {
      return "Duh";
    }
    // return function(input) {
    //   switch (expr) {
    //     case "Seasonal Fast Food Restaurant":
    //       return "Restaurant";
    //     case "Fast Food Restaurant":
    //       return "Restaurant";
    //     case "Full Service Restaurant":
    //       return "Restaurant";
    //     case "Public Middle or High School Food Service":
    //       return "Education";
    //     case "Mobile Food Unit":
    //       return "Mobile Food";
    //     default:
    //       return "Other";
    //   }
    });
