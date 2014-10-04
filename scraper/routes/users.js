// users.js
//

var express = require('express');
var router = express.Router();
var parseBikesModule = require('../modules/parsebikes.js');

/* GET users listing. */

router.get('/', function(req, res) {
  // res.send('respond with a resource');
  parseBikesModule.parseBikes();

  res.status(200).end();
});

module.exports = router;

// exports.parseBikes = parseBikes;
