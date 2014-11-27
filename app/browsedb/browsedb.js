'use strict';

angular.module('myApp.browsedb', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/browsedb', {
    templateUrl: 'browsedb/browsedb.html',
    controller: 'BrowseDbCtrl'
  });
}])

.controller('BrowseDbCtrl', ['$scope', 'AWSService', function($scope, AWSService) {
	// console.log("'BrowseDbCtrl', ['AWSService'");
	$scope.test = 'Controller was here';

	AWSService.dynamoBikesRO().then(function(table) {
		console.log('drcribingTable using table: ', table);
		table.describeTable({TableName: 'bikeshistory'}, function(err, data) { // TODO: Table name elsewhere
			if (err)
				console.error(err, err.stack); // an error occurred
			else {
				console.log(data);           // successful response
				$scope.itemsCount = data.Table.ItemCount;
				$scope.$apply(); // looks like sitting inside the promise has some side effects
				table.query({
					TableName: 'bikeshistory',  // TODO: Table name elsewhere
					KeyConditions: {
						period: {
							ComparisonOperator: 'EQ',
							AttributeValueList: [
								{ S: 'State' }
							],
						}
					},
					Limit: 1,
					ScanIndexForward: false
				}, function(err, data) {
					if (err)
						console.log(err, err.stack); // an error occurred
					else {
						console.log(data);           // successful response
						$scope.recent = data.Items;
						$scope.$apply(); // looks like sitting inside the promise has some side effects
					}
				});
			}
		});
	});
}]);
