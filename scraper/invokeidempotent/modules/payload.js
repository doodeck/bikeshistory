// payload.js

var parseBikesModule = require('../../modules/parsebikes.js');

exports.handler = function(callback) {
  var startingMoment = +new Date();
  console.log('payload: ', new Date(startingMoment).toString());

  var index = 0;
  var theInterval = setInterval(function() {
    var delta = +new Date() - startingMoment;
    console.log('index: ', index++, new Date(delta).toString());
    if (index > 5) {
      clearInterval(theInterval);
      callback(undefined, { status: true, msg: "Quit happily" });
    }
  }, (10 * 100));
  // parseBikesModule.parseBikes();
}