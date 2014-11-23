// navigation.js

'use strict';

angular.module('myApp.navigation', [])
.controller('NavigationCtrl', ['$scope', '$location',
	function($scope, $location) {
		$scope.hello = "NavigationCtrl was here";

		$scope.$on('$locationChangeStart', function(event, next, current) {
			console.log('locationChangeStart: ', event, next, current);

			var path = $location.path(), routeIndex = -1;
			if (path.indexOf('/view2') >= 0)
				routeIndex = 1;
			else if (path.indexOf('/view1') >= 0)
				routeIndex = 0;
			$scope.navigation = [
				{
					active: (routeIndex === 0 ? "active" : "")
				},
				{
					active: (routeIndex === 1 ? "active" : "")
				}
			];

			// <li class="active"><a href="#/view1">View 1<span class="sr-only">(current)</span></a></li>

		});
		$scope.$on('$locationChangeSuccess', function(event, next, current) {
			console.log('locationChangeSuccess: ', event, next, current);
		});
	}]);
