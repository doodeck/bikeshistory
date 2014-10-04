// dbfire.js
//

var Firebase = require("firebase");
var config = require('../config');

var _rootPath = "https://bikeshistory.firebaseio.com" +
               (config.tmpDatabase ? "/tmp/" : "/");
var _myFirebaseRef = new Firebase(_rootPath + "states");
var _fbFullRef = new Firebase(_rootPath + "fullstates");

exports.myFirebaseRef = function() {
	return _myFirebaseRef;
}
exports.fbFullRef = function() {
	return _fbFullRef;
}
