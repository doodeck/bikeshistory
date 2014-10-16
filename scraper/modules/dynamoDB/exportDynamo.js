// exportDynamo.js
//
// Exporting to DynamoDB
//

var dbfire = require('../dbfire');
var config = require('../../config');
var AWS = require('aws-sdk');
var DOC = require("../../lib/dynamodb-doc");
AWS.config.loadFromPath('./' + config.AWS.configFile);
// AWS.config.region = config.AWS.region;
AWS.config.update({region: config.AWS.region });
var tables = require('./createTables')

// var dynamodb = new AWS.DynamoDB({region: config.AWS.region});
var docClient = new DOC.DynamoDB(/*dynamodb*/);

var myFirebaseRef = dbfire.myFirebaseRef();
var fbFullRef = dbfire.fbFullRef();


// TODO: returns jobId
exports.startexport = function(values) {
	var prop;

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
	  	// console.log('about to put: ', snapshotVal[prop]);
		var formData = {
			TableName: config.AWS.dynamoDBtable,
			Item: {
			  timestamp: snapshotVal[prop].timestamp,
			  state: snapshotVal[prop].state
			  /* good for dynamoDB:
			  timestamp: { 'N': snapshotVal[prop].timestamp.toString() },
			  state: { 'M': { "1st": { 'S': "I'm 1st"}, "2nd": {'S': "I'm second"}, "3rd":
			            { 'L': [ {'S': "This"}, { 'S': "is"}, {'S': "Array"} ] } } }
			  */
			}
		};
		// dynamodb.putItem(formData, function(err, data) {
		docClient.putItem(formData, function(err, data) {

	     if (!!err) {
	      console.log('Insert failed: ', err, ', item ',
	                  prop, ' reinsertd');
	      props.push(prop); // should the 1st insert fail the process will be aborted, since no chain exportItem() will be called
	     } else {
			console.log('Insert ok: ', /*docs[0]["_id"],*/ 'items left: ', props.length);
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

}
