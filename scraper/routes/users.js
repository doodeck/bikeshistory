var express = require('express');
var router = express.Router();
var parseBikesModule = require('../modules/parsebikes.js');

/* GET users listing. */

router.get('/', function(req, res) {
  // res.send('respond with a resource');
  parseBikesModule.parseBikes();

  res.send(200);
});

module.exports = router;

// exports.parseBikes = parseBikes;
