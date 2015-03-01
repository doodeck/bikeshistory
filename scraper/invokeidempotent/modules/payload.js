// payload.js

// that is not working. The complaint is about '../config' in dbfire.js  var parseBikesModule = require('../../modules/parsebikes.js');

exports.handler = function() {
  var startingMoment = +new Date();
  console.log('payload: ', new Date(startingMoment).toString());
  // parseBikesModule.parseBikes();
}