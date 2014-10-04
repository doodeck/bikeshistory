// exporting.js
//

var dbfire = require('./dbfire');

var myFirebaseRef = dbfire.myFirebaseRef();
var fbFullRef = dbfire.fbFullRef();

// values:
/*
params: { host: 'h',
  port: '777',
  username: 'u',
  password: 'p',
  database: 'd',
  collS: 's',
  collFullS: 'fools' }
*/
// returns jobId
exports.startexport = function(values) {

	myFirebaseRef.on('value', function (snapshot) {
	  console.log(snapshot.val());
	}, function (errorObject) {
	  console.log('The read failed: ' + errorObject.code);
	});

}


