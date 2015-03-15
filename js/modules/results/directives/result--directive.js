module.exports = function(ngModule) {

  ngModule.directive('result', [function() {

      var directive = {
        restrict: 'E',
        replace: false,
        templateUrl: '/templates/result.html',
        controllerAs: 'ctrl'
      };

      directive.link = function(scope, element, attrs) {
        scope.restaurant = scope.$eval(attrs.data);
      };

      return directive;

  }]);

  ngModule.run(['$templateCache', function($templateCache) {
    $templateCache.put('/templates/result.html',
    require('./../templates/result--template.html'));
  }]);

};
