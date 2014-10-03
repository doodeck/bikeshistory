var https = require('https');
var request = require('request');
var Firebase = require("firebase");
var hash = require("string-hash");
var fs = require('fs');

var myFirebaseRef = new Firebase("https://bikeshistory.firebaseio.com/tmp/states");
var fbFullRef = new Firebase("https://bikeshistory.firebaseio.com/tmp/fullstates");
var responseBuffer = null;
var scrapeURL = "https://www.bikes-srm.pl/Mobile/LocationsMap.aspx";
var pushFirebaseRecord, pushFirebaseFullState, parseBikesHttps, parseBikesRequest, parseBikesTest, d2h, conditionalPushRecord;
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


pushFirebaseRecord = function(buffer) {
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

pushFirebaseFullState = function(fullState) {
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
      } else {
        newItem.once('value', function(dataSnapshot) {
	  currentTimestamp = dataSnapshot.val().timestamp;
	  // console.log('got current timestamp: ', currentTimestamp);
          conditionalPushRecord(fullState, currentTimestamp);

	  // push the latest update time, just for debug
          adminUpdateRef = myFirebaseRef.child('admin/latestWritten');
	  adminUpdateRef.set(currentTimestamp);
	});
      }
    });
}

parseBikesHttps = function() {
  https.get(scrapeURL, function(ress) {
    // console.log("Got response: " + ress.statusCode);
    // console.log(ress);
    responseBuffer = "";

    ress.on('data', function(d) {
      // process.stdout.write(d);
      responseBuffer = responseBuffer.concat(d);
    });

    // This never happens
    ress.on('end', function(){
        // console.log("End received!");
        pushFirebaseRecord(responseBuffer);
        responseBuffer = "";
    });

    // But this does
    ress.on('close', function(){
        console.log("Close received!");
        pushFirebaseRecord(responseBuffer);
        responseBuffer = "";
    });

    // process.stdout.write('->' + responseBuffer);

  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}

parseBikesRequest = function() {
  request(scrapeURL, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(body);
      pushFirebaseRecord(body);
    }
  });
}

parseBikesTest = function() {
  if (!testArray) {
    testArray = JSON.parse(fs.readFileSync('.samples.xml'));
    console.log('Digested testArray, which turned out to contain ',
                testArray.length, ' items');
  }
  // console.log('pushFirebaseFullState[', testArrayIndex, ']');
  pushFirebaseFullState(testArray[testArrayIndex]);
  testArrayIndex++;
  testArrayIndex %= testArray.length;
}

exports.parseBikes = function() {
  // return parseBikesTest();
  return parseBikesRequest();
  // return parseBikesHttps();
}
