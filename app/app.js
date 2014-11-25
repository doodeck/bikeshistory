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
.config(function(AWSServiceProvider) {
  AWSServiceProvider
    .setDynamoParams(
      'arn:aws:iam::915133436062:role/google-web-role');
})
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
