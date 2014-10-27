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

// it may modify the fullState which it got passed
exports.pushFirebaseFullState = pushFirebaseFullState = function(fullState) {
  var shortState = [], station, nameHash;
  var newItem, currentTimestamp, adminUpdateRef;
  var payload, fullPayload;


  for (station in fullState) {
    // console.log('station: ', station, ', ', fullState[station]);
    nameHash = hash(fullState[station].LocalTitle);
    shortState.push({ avail: fullState[station].AvailableBikesCount,
                      free: fullState[station].FreeLocksCount
		      // hash: /*d2h(*/nameHash/*)*/
        });
    // TODO: LocalInformation can be parsed to retrieve various kind of bikes available

    delete fullState[station].AvailableBikesCount;
    delete fullState[station].FreeLocksCount;
    delete fullState[station].LocalInformation;
    delete fullState[station].StatusPercentageNumber;
  }

  fullPayload = {
    state: fullState
  };

  dbClient.conditionalPutFullItem(fullPayload, function(err, data) {  
    if (!!err) {
      console.log('Insert failed: ', err, ', item ', shortState);
    } else {
      // console.log('Insert Full ok: ', data /*docs[0]["_id"],*/);

      payload = {
        fullId: data.item.timestamp,
        state: shortState
      };
      // dynamodb.putItem(formData, function(err, data) {
      // dbClient.docClient.putItem(formData, function(err, data) {
      // dbClient.putStateItem(payload, function(err, data) {
      dbClient.conditionalPutStateItem(payload, function(err, data) {  
        if (!!err) {
          console.log('Insert failed: ', err, ', item ', shortState);
        } else {
          // console.log('Insert ok: ', formData.Item.timestamp /*docs[0]["_id"],*/);
        }
      });

    }
  });
}
