var https = require('https');
var Firebase = require("firebase");
var hash = require("string-hash");
var myFirebaseRef = new Firebase("https://bikeshistory.firebaseio.com/states");
var responseBuffer = "";
var pushFirebaseRecord, parseBikes, d2h, conditionalPushRecord;

d2h = function(d) {
  return (+d).toString(16).toUpperCase();
}

pushFirebaseRecord = function(buffer) {
  // var re = /var mapDataLocations = [{.+}]/;
  var re = /var\s+mapDataLocations\s*=\s*(\[.+\])\s*\;/;
  var capture, fullState, shortState = [], station, nameHash;
  var newItem;
  // buffer = 'var mapDataLocations = [{cghxzgchxgchxz}];';
  
  // conditionalPushRecord(buffer);

  capture = re.exec(buffer)[1];
  // console.log(capture);

  fullState = JSON.parse(capture);

  // console.log('fool: ', fullState);
  for (station in fullState) {
    // console.log('station: ', station, ', ', fullState[station]);
    nameHash = hash(fullState[station].LocalTitle);
    shortState.push({ A: fullState[station].AvailableBikesCount,
                      F: fullState[station].FreeLocksCount,
		      H: /*d2h(*/nameHash/*)*/ });
  }

  // myFirebaseRef.push({timestamp: Firebase.ServerValue.TIMESTAMP, state: shortState});
  newItem = myFirebaseRef.push();
  newItem.setWithPriority({timestamp: Firebase.ServerValue.TIMESTAMP, state: shortState}, Firebase.ServerValue.TIMESTAMP);
}

// push either short or long record, depending on the last modification time
conditionalPushRecord = function(buffer) {
// startAt(1409171793939).endAt(1409171793939).
  myFirebaseRef.once('value',
    function(dataSnapshot) { // success
      console.log('Snapshot: ', dataSnapshot);
    },
    function(error) { // failure
      console.log('myFirebaseRef.once("value") failed: ', error);
    });
}

exports.parseBikes = parseBikes = function() {

  https.get("https://www.bikes-srm.pl/Mobile/LocationsMap.aspx", function(ress) {
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
