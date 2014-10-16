// dbDynamo.js
//

var config = require('../../config');
var AWS = require('aws-sdk');
var DOC = require("../../lib/dynamodb-doc");
AWS.config.loadFromPath('./' + config.AWS.configFile);
// AWS.config.region = config.AWS.region;
AWS.config.update({region: config.AWS.region });
var tables = require('./createTables')

// var dynamodb = new AWS.DynamoDB({region: config.AWS.region});
exports.docClient = new DOC.DynamoDB(/*dynamodb*/);
