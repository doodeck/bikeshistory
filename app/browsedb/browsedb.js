'use strict';

angular.module('myApp.browsedb', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/browsedb', {
    templateUrl: 'browsedb/browsedb.html',
    controller: 'BrowseDbCtrl'
  });
}])

.controller('BrowseDbCtrl', ['AWSService', function(AWSService) {
	console.log("'BrowseDbCtrl', ['AWSService'");
	AWSService.dynamoBikesRO().then(function(table) {
		// find the user by email
		table.describeTable({TableName: 'bikeshistory'}, function(err, data) { // TODO: Table name elsewhere
			if (err)
				console.error(err, err.stack); // an error occurred
			else
				console.log(data);           // successful response
		});
	});
}]);
