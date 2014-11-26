// aws-service.js

'use strict';

angular.module('myApp.credentials', [])
// .factory(
.provider('AWSService', function() {
	var self = this;

	self.params = undefined;

	self.setDynamoParams = function(params) {
		console.log('setting setDynamoParams:', params);
		self.params = params;
	}

	self.$get = function($q, $cacheFactory) {
	var dynamoCache = $cacheFactory('dynamo'),
	    credentialsDefer = $q.defer(),
	    credentialsPromise = credentialsDefer.promise;
	// console.log('AWSService initialized');

	var shinyNewServiceInstance = {
		// "arn:aws:dynamodb:us-east-1:123456789012:table/books_table"
		dynamoBikesRO: function() {
		  console.log('AWSService: making promises with: ', self.params);

		  var d = $q.defer();
		  credentialsPromise.then(function(params) {
		  	console.log('AWSService: promise then, params: ', self.params);
			var table = dynamoCache.get(JSON.stringify(params));
			if (!table) {
				var table = new AWS.DynamoDB(params);
				dynamoCache.put(JSON.stringify(params), table);
			};
			d.resolve(table);
		  });
		  if (!!self.params)
		  	credentialsDefer.resolve(self.params);
		  return d.promise;
		}
	};

	// factory function body that constructs shinyNewServiceInstance
	return shinyNewServiceInstance;
	}

});
