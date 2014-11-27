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
	var assumeWebIdentityCredentials = function(callback) {
		AWS.config.region = 'eu-west-1';
		// var creds = 
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			AccountId: '915133436062',
			IdentityPoolId: 'eu-west-1:eda60e6a-b2ce-47b2-b00a-060894261b8a',
			RoleArn: 'arn:aws:iam::915133436062:role/Cognito_bikeshistory_ROUnauth_DefaultRole'
		});
		AWS.config.credentials.get(function(err) {
			if (!err) {
				console.log("Cognito Identity Id: " + AWS.config.credentials.identityId);
				callback(undefined, AWS.config.credentials);

				/*
				AWS.config.credentials = new AWS.WebIdentityCredentials({
				  RoleArn: 'arn:aws:iam::1234567890:role/WebIdentity',
				  WebIdentityToken: 'ABCDEFGHIJKLMNOP', // token from identity service
				  RoleSessionName: 'web' // optional name, defaults to web-identity
				});
				*/
			} else {
				console.log('Cognito.get failed: ', err);
				callback(err, undefined);
			}
		});
	};

	var shinyNewServiceInstance = {
		// "arn:aws:dynamodb:us-east-1:123456789012:table/books_table"
		dynamoBikesRO: function() {
		  console.log('AWSService: making promises with: ', self.params);

		  var d = $q.defer();
		  credentialsPromise.then(function(params) {
		  	/* works, but cannot be publicly posted to github, without triggering an immediate response from AWS security team
		  	var creds = new AWS.Credentials('AKIAIGN**********LUA', '****************************************');
			AWS.config.credentials = creds;
			*/
		  	/* params.credentials = creds; */

		  	console.log('AWSService: promise then, params: ', params);
			var table = dynamoCache.get(JSON.stringify(params));
			if (!table) {
				assumeWebIdentityCredentials(function(error, credentials) {
				    console.log('assumeWebIdentityCredentials: ', error, credentials);		
					/*var*/ table = new AWS.DynamoDB(params);
					table.credentials = credentials;
					dynamoCache.put(JSON.stringify(params), table);
					d.resolve(table);
				});
			} else {
				d.resolve(table);
			}
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
