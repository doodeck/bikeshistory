// exportDynamo.js
//
// export Firebase to DynamoDB
//

var express = require('express');
var router = express.Router();
var exportDynamo = require('../modules/dynamoDB/exportDynamo');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('exportDynamo', { title: 'Export to DynamoDB' });
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
  jobId = exportDynamo.startexport(values);
  res.render('exportDynamo', { title: ('Export started ..., jobId: ' + values.toString()) });
  // console.log('rendered');
  // res.status(status).end()

});

module.exports = router;
