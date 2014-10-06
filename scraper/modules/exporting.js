// exporting.js
//

var dbfire = require('./dbfire');
var mongodb = require('mongodb');

var myFirebaseRef = dbfire.myFirebaseRef();
var fbFullRef = dbfire.fbFullRef();
var MongoClient = mongodb.MongoClient;

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
// TODO: returns jobId
exports.startexport = function(values) {
	var prop;
	var dbUrl = 'mongodb://' + values.username + ':' + values.password + '@' + 
	            values.host + ':' + values.port + '/' + values.database;

// mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
	console.log('dbUrl: ', dbUrl);

	MongoClient.connect(dbUrl, function(err, db) {
    if(err) throw err;

	var collectionStates = db.collection('bikeshistory');

	myFirebaseRef.once('value', function (snapshot) {
		var snapshotVal = snapshot.val();
	  // console.log(snapshot.val());
	  for (prop in snapshotVal) {
	  	if (prop !== 'admin') {
		  	console.log('prop: ', prop); // , 'val: ', snapshotVal[prop]);
	        collectionStates.insert(snapshotVal[prop], function(err, docs) {
	        	if (!!err) {
	        		console.log('Insert failed: ', err);
	        	} else {
	        		console.log('Insert ok: ', docs[0]["_id"]);
	        	}
	        });
	  	}
	  }
	}, function (errorObject) {
	  console.log('The read failed: ' + errorObject.code);
	});

    // premature here, everything happens asynchroneously ! db.close();


    /*
    var collection = db.collection('test_insert');
    collection.insert({a:2}, function(err, docs) {

      collection.count(function(err, count) {
        console.log("count = ", count);
      });

      // Locate all the entries using find
      collection.find().toArray(function(err, results) {
        console.dir(results);
        // Let's close the db
        db.close();
      });
    });
    */
  });

}


