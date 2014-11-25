// aws-service.js

'use strict';

angular.module('myApp.credentials', [])
// .factory(
.provider('AWSService', function() {
	var self = this;

	self.setDynamoParams = function(params) {
		console.log('setting setDynamoParams:', params);
	}

	self.$get = function($q, $cacheFactory) {
	var dynamoCache = $cacheFactory('dynamo'),
	    credentialsDefer = $q.defer(),
	    credentialsPromise = credentialsDefer.promise;
	// console.log('AWSService initialized');

	var shinyNewServiceInstance = {
		// "arn:aws:dynamodb:us-east-1:123456789012:table/books_table"
		dynamoBikesRO: function() {
		  // console.log('AWSService: making promises');
		  var params = {TableName: 'bikeshistory'}; // TODO: get it from a service config

		  var d = $q.defer();
		  credentialsPromise.then(function(credentials) {
		  	console.log('AWSService: promise then');
			var table = dynamoCache.get(JSON.stringify(params));
			if (!table) {
				// these are very limited read-only credentials. They are exposing only a single table, which
				// content is supposed to be public anyway.
				params.credentials = credentials;
				params.region = 'eu-west-1'; // TODO: service provider
				var table = new AWS.DynamoDB(params);
				dynamoCache.put(JSON.stringify(params), table);
			};
			d.resolve(table);
		  });
		  credentialsDefer.resolve(new AWS.Credentials('AKIAJIZZB77YPOOB35QQ', 'QaOQ+yk7hKsXFdJfrqBdudD0NNPdvCt3LaQB9FUK')); // sure no promise was in fact needed here
		  return d.promise;
		},
		setDynamoParams: function(params) {
			console.log('shinyNewServiceInstance::setDynamoParams:', params);
		}
	};

	// factory function body that constructs shinyNewServiceInstance
	return shinyNewServiceInstance;
	}

});
