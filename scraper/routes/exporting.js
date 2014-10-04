// exporting.js
//

var express = require('express');
var router = express.Router();
var exporting = require('../modules/exporting');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('exporting', { title: 'Export to MongoDB' });
});

router.post('/', function(req, res) {
	var jobId;
	var values = req._body ? req.body : req.query || {};
	console.log('params:', values); // , req.params);
    /*
params: { host: 'h',
  port: '777',
  username: 'u',
  password: 'p',
  database: 'd',
  collS: 's',
  collFullS: 'fools' }
    */
  jobId = exporting.startexport(values);
  res.render('exporting', { title: ('Export started ..., jobId: ' + values.toString()) });
  // console.log('rendered');
  // res.status(status).end()

});

module.exports = router;
