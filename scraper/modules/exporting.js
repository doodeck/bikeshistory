// exporting.js
//
// Exporting to mongoDB
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
    if (!err) { // throw err;

		var collectionStates = db.collection('bikeshistory');
		var trainToMongo = [];

		myFirebaseRef.once('value', function (snapshot) {
			var snapshotVal = snapshot.val();
		  // console.log(snapshot.val());
		  for (prop in snapshotVal) {
		  	if (prop !== 'admin') {
			  console.log('prop: ', prop); // , 'val: ', snapshotVal[prop]);
			  trainToMongo.push(prop);
		  	}
		  }

		// the export itself
		function exportItem(props) {
		  var prop = props.pop();

		  if (!!prop) {
		    collectionStates.insert(snapshotVal[prop], function(err, docs) {
		     if (!!err) {
		      console.log('Insert failed: ', err, ', item ',
		                  prop, ' reinsertd');
		      props.push(prop); // should the 1st insert fail the process will be aborted, since no chain exportItem() will be called
		     } else {
		      console.log('Insert ok: ', docs[0]["_id"], 'items left: ', props.length);
		      // works very nicely but manages just a few items per second setTimeout(exportItem, 0, props);
		      exportItem(props);
		      exportItem(props);
	            }
		    });
		  } else {
		    console.log('Export happily finished');
		  }
	        }

	        exportItem(trainToMongo);

		}, function (errorObject) {
		  console.log('The read failed: ' + errorObject.code);
		});
		
	    // premature here, everything happens asynchroneously ! db.close();
    } else {
    	console.log('Error, export aborted: ', err);
    }

  });

}


