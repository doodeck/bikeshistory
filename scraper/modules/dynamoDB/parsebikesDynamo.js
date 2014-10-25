// parsebikesDynamo.js
//


var hash = require("string-hash");
var fs = require('fs');
var config = require('../../config');
var dbClient = require('./dbDynamo'); // .docClient;

var pushFirebaseRecord, pushFirebaseFullState, d2h, conditionalPushRecord;
var testArray = null, testArrayIndex = 0;

d2h = function(d) {
  return (+d).toString(16).toUpperCase();
}

// conditionally push long record, depending on the last modification time
conditionalPushRecord = function(fullState, currentTimestamp) {
  var newRecord, childRef, delta;
  var writeInterval = 86400000; // milliseconds

  childRef = fbFullRef.child("latestWritten");
  childRef.once('value', function(dataSnapshot) {
    if (!!(dataSnapshot.val())) {
      delta = parseInt(currentTimestamp) - parseInt(dataSnapshot.val());
      /*console.log('retrieved latestWritten: ', parseInt(dataSnapshot.val()),
                'delta: ', delta);*/
    } else {
      console.log('not retrieved latestWritten writing the record '),
      delta = 666 + writeInterval;
    }

    if (delta > writeInterval) {
      console.log('writing the full record, delta: ', delta),
      newRecord = fbFullRef.push();
      newRecord.setWithPriority({timestamp: Firebase.ServerValue.TIMESTAMP, state: fullState},
        Firebase.ServerValue.TIMESTAMP,
        function(error) {
          if (!!error) {
            console.log('newRecord.setWithPriority failed: ', error);
          } else {
            newRecord.once('value', function(dataSnapshot) {
            /*console.log('newRecord.setWithPriority success, writing into', childRef,
                        ', content: ', dataSnapshot.val());*/
              childRef.set(dataSnapshot.val().timestamp); // newRecord.timestamp);
          });
        }
       });
     }
   });
}


exports.pushFirebaseRecord = pushFirebaseRecord = function(buffer) {
  // var re = /var mapDataLocations = [{.+}]/;
  var re = /var\s+mapDataLocations\s*=\s*(\[.+\])\s*\;/;
  var capture, fullState;
  // buffer = 'var mapDataLocations = [{cghxzgchxgchxz}];';
  
  capture = re.exec(buffer)[1];
  // console.log(capture);

  /*
  fs.writeFile('.sample.xml', capture, function(err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });
  */

  fullState = JSON.parse(capture);

  // console.log('fool: ', fullState);
  pushFirebaseFullState(fullState);
}

exports.pushFirebaseFullState = pushFirebaseFullState = function(fullState) {
  var shortState = [], station, nameHash;
  var newItem, currentTimestamp, adminUpdateRef;

  for (station in fullState) {
    // console.log('station: ', station, ', ', fullState[station]);
    nameHash = hash(fullState[station].LocalTitle);
    shortState.push({ A: fullState[station].AvailableBikesCount,
                      F: fullState[station].FreeLocksCount,
		      H: /*d2h(*/nameHash/*)*/ });
  }

    // console.log('about to put: ', snapshotVal[prop]);
  /*
  var formData = {
    TableName: config.AWS.dynamoDBtable,
    Item: {
      period: "HashValue",
      timestamp: new Date().getTime(), // as of today (Oct'14) there is no server time available
      state: shortState
    }
  };
  */
  var payload = {
    state: shortState
  };
  // dynamodb.putItem(formData, function(err, data) {
  // dbClient.docClient.putItem(formData, function(err, data) {
  dbClient.putStateItem(payload, function(err, data) {
    if (!!err) {
      console.log('Insert failed: ', err, ', item ', shortState);
    } else {
      // console.log('Insert ok: ', formData.Item.timestamp /*docs[0]["_id"],*/);
    }
  });

  /* now take care of
          conditionalPushRecord(fullState, currentTimestamp);
          to a different table I guess
  */
}
