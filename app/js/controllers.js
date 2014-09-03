'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('MyCtrl1', ['$scope', '$firebase',
    function($scope, $firebase) {
      var bindingTo = true;

      var ref = new Firebase(GlobalConfig.FirebaseRef);

      // create an AngularFire reference to the data
      var sync = $firebase(ref);

      if (!bindingTo) {
        // download the data into a local object
        $scope.data = sync.$asObject();//
      } else {
        //
        var syncObject = sync.$asObject(); // simple key/value data

        // synchronize the object with a three-way data binding
        // click on `index.html` above to see it used in the DOM!
        syncObject.$bindTo($scope, "data");
        //
      }
    }])
  .controller('MyCtrl2', ['$scope', '$firebase',
    function($scope, $firebase) {
      var ref = new Firebase(GlobalConfig.FirebaseRef);
      var sync = $firebase(ref);

      // create a synchronized array for use in our HTML code
      $scope.messages = sync.$asArray();

      $scope.addMessage = function(text) {
        $scope.messages.$add({text: text});
      }
    }]);
