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
    .setDynamoParams({
      TableName: 'bikeshistory',
      // accessKeyId: 'AKIAJIZZB77YPOOB35QQ', // these are very limited read-only credentials. They are exposing only a single table, which
      // secretAccessKey: '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' // content is supposed to be public anyway.
      region: 'eu-west-1',
      // NEVER commit credentials which give access beyond that single table, see the
      // template components/credentails/policy.acl file how they should look like
      /*
      Addendum:
      Still, the moment I published the above credentials to github, AWS generated an automated
      support case with the subject "Your account has been compromised". Having failed to react
      20 hours later I received a phone call from a friendly AWS consultant, who informed
      me, that they do not allow publishing valid access keys to the outside world. So now
      the above key/secret are no longer valid AWS credentials...
      */
  });
})
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
