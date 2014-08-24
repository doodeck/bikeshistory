var https = require('https');
var Firebase = require("firebase");
var myFirebaseRef = new Firebase("https://bikeshistory.firebaseio.com/");
var responseBuffer = "";
var pushFirebaseRecord, parseBikes;

pushFirebaseRecord = function(buffer) {
  // var re = /var mapDataLocations = [{.+}]/;
  var re = /var\s+mapDataLocations\s*=\s*(\[.+\])\s*\;/;
  var capture;
  // buffer = 'var mapDataLocations = [{cghxzgchxgchxz}];';
  
  capture = re.exec(buffer)[1];
  // console.log(capture);

  myFirebaseRef.push({timestamp: Firebase.ServerValue.TIMESTAMP, state: JSON.parse(capture)});

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
