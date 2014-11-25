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
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
