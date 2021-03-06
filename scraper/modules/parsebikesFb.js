// parsebikesFb.js
//


var Firebase = require("firebase");
var hash = require("string-hash");
var fs = require('fs');
var dbfire = require('./dbfire');

var myFirebaseRef = dbfire.myFirebaseRef();
var fbFullRef = dbfire.fbFullRef();

var pushFirebaseRecord, pushFirebaseFullState, d2h, conditionalPushRecord;
var testArray = null, testArrayIndex = 0;

d2h = function(d) {
  return (+d).toString(16).toUpperCase();
}

// conditionally push long record, depending on the last modification time
conditionalPushRecord = function(fullState, currentTimestamp, callback) {
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
            if (!!callback) {
              callback(error, { msg: "setWithPriority failed" });
            }
          } else {
            newRecord.once('value', function(dataSnapshot) {
            /*console.log('newRecord.setWithPriority success, writing into', childRef,
                        ', content: ', dataSnapshot.val());*/
              childRef.set(dataSnapshot.val().timestamp); // newRecord.timestamp);
              if (!!callback) {
                callback(undefined, { msg: "conditionalPushRecord success" });
              }
          });
        }
       });
     } else {
      if (!!callback) {
        callback(undefined, { msg: "conditionalPushRecord(2) success" });
      }
     }
   });
}


exports.pushFirebaseRecord = pushFirebaseRecord = function(buffer, callback) {
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
  pushFirebaseFullState(fullState, callback);
}

exports.pushFirebaseFullState = pushFirebaseFullState = function(fullState, callback) {
  var shortState = [], station, nameHash;
  var newItem, currentTimestamp, adminUpdateRef;

  for (station in fullState) {
    // console.log('station: ', station, ', ', fullState[station]);
    nameHash = hash(fullState[station].LocalTitle);
    shortState.push({ A: fullState[station].AvailableBikesCount,
                      F: fullState[station].FreeLocksCount,
		      H: /*d2h(*/nameHash/*)*/ });
  }

  // myFirebaseRef.push({timestamp: Firebase.ServerValue.TIMESTAMP, state: shortState});
  newItem = myFirebaseRef.push();
  newItem.setWithPriority({timestamp: Firebase.ServerValue.TIMESTAMP, state: shortState}, Firebase.ServerValue.TIMESTAMP,
    function(error) {
      if (!!error) {
        console.log('newItem.setWithPriority failed: ', error);
        if (!!callback) {
          callback(error, { msg: "setWithPriority failed" });
        }
      } else {
        newItem.once('value', function(dataSnapshot) {
    	  currentTimestamp = dataSnapshot.val().timestamp;
    	  // console.log('got current timestamp: ', currentTimestamp);
        conditionalPushRecord(fullState, currentTimestamp, function(err, data) {

          // push the latest update time, just for debug
          adminUpdateRef = myFirebaseRef.child('admin/latestWritten');
          adminUpdateRef.set(currentTimestamp);

          if (!!callback) {
            callback(undefined, { msg: "pushFirebaseFullState() success" });
          }
        });
    	});
    }
  });
}
