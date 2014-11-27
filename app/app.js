'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ui.bootstrap',
  // 'ui.bootstrap.tabs',
  'myApp.navigation',
  'myApp.view1',
  'myApp.view2',
  'myApp.browsedb',
  'myApp.version',
  'myApp.credentials'
])
.config(function(AWSServiceProvider) { // is providing the .provider('AWSService', ...
  AWSServiceProvider
    .setAWSparams({
      dynamoDB: {
        TableName: 'bikeshistory',
        region: 'eu-west-1',
      },
      cognito: {
        AccountId: '915133436062',
        IdentityPoolId: 'eu-west-1:eda60e6a-b2ce-47b2-b00a-060894261b8a',
        RoleArn: 'arn:aws:iam::915133436062:role/Cognito_bikeshistory_ROUnauth_DefaultRole'
        // it looks like (4 hours after) committing Cogito ids is not triggerting the rapid response of AWS ERT,
        // doing so with the valid credentials would have caused such an action
      }
  });
})
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
