var https = require('https');
var request = require('request');
var hash = require("string-hash");
var fs = require('fs');
var bikesDbFb = require('./parsebikesFb');
var bikesDbDynamo = require(/*'./dynamoDB/*/ './parsebikesDynamo');
var config = require('../config');

var responseBuffer = null;
var scrapeURL = "https://www.bikes-srm.pl/Mobile/LocationsMap.aspx";
var parseBikesHttps, parseBikesRequest, parseBikesTest, conditionalPushRecord;
var testArray = null, testArrayIndex = 0;

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
        if (config.dbDriver.firebase) {
          bikesDbFb.pushFirebaseRecord(responseBuffer);
        }
        if (config.dbDriver.dynamoDB) {
          bikesDbDynamo.pushFirebaseRecord(responseBuffer);
        }
        responseBuffer = "";
    });

    // But this does
    ress.on('close', function(){
        console.log("Close received!");
        if (config.dbDriver.firebase) {
          bikesDbFb.pushFirebaseRecord(responseBuffer);
        }
        if (config.dbDriver.dynamoDB) {
          bikesDbDynamo.pushFirebaseRecord(responseBuffer);
        }
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
      if (config.dbDriver.firebase) {
        bikesDbFb.pushFirebaseRecord(body);
      }
      if (config.dbDriver.dynamoDB) {
        bikesDbDynamo.pushFirebaseRecord(body);
      }
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
  if (config.dbDriver.firebase) {
    bikesDbFb.pushFirebaseFullState(testArray[testArrayIndex]);
  }
  if (config.dbDriver.dynamoDB) {
    bikesDbDynamo.pushFirebaseFullState(testArray[testArrayIndex]);
  }
  testArrayIndex++;
  testArrayIndex %= testArray.length;
}

exports.parseBikes = function() {
  // return parseBikesTest();
  return parseBikesRequest();
  // return parseBikesHttps();
}
