var https = require('https');
var Firebase = require("firebase");
var myFirebaseRef = new Firebase("https://bikeshistory.firebaseio.com/");
var responseBuffer = "";
var pushFirebaseRecord, parseBikes;

pushFirebaseRecord = function(buffer) {
  // var re = /var mapDataLocations = [{.+}]/;
  var re = /var\s+mapDataLocations\s*=\s*(\[.+\])\s*\;/;
  var capture, fullState, shortState = [], station;
  // buffer = 'var mapDataLocations = [{cghxzgchxgchxz}];';
  
  capture = re.exec(buffer)[1];
  // console.log(capture);

  fullState = JSON.parse(capture);

  // console.log('fool: ', fullState);
  for (station in fullState) {
    // console.log('station: ', station, ', ', fullState[station]);
    shortState.push({ AvailableBikesCount : fullState[station].AvailableBikesCount,
                      FreeLocksCount: fullState[station].FreeLocksCount,
		      LocalTitle: fullState[station].LocalTitle });
  }

  myFirebaseRef.push({timestamp: Firebase.ServerValue.TIMESTAMP, state: shortState});
}

exports.parseBikes = parseBikes = function() {

  https.get("https://www.bikes-srm.pl/Mobile/LocationsMap.aspx", function(ress) {
    console.log("Got response: " + ress.statusCode);
    // console.log(ress);
    responseBuffer = "";

    ress.on('data', function(d) {
      // process.stdout.write(d);
      responseBuffer = responseBuffer.concat(d);
    });

    // This never happens
    ress.on('end', function(){
        console.log("End received!");
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
