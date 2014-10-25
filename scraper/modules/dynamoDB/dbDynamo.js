// dbDynamo.js
//

var config = require('../../config');
var AWS = require('aws-sdk');
var DOC = require("../../lib/dynamodb-doc");
AWS.config.loadFromPath('./' + config.AWS.configFile);
// AWS.config.region = config.AWS.region;
AWS.config.update({region: config.AWS.region });
var tables = require('./createTables');


// var dynamodb = new AWS.DynamoDB({region: config.AWS.region});
var docClient = new DOC.DynamoDB(/*dynamodb*/);

// exports.config = CONFIG;
global.NODE_docClient = global.NODE_docClient ? global.NODE_docClient : docClient;

// module.exports = global.NODE_docClient;
exports.docClient = global.NODE_docClient;

exports.putStateItem = function(payload, callback) {
  var formData = {
    TableName: config.AWS.dynamoDBtable,
    Item: {
      period: "HashValue",
      timestamp: new Date().getTime()
    }
  };
  for (var prop in payload) {
    formData.Item[prop] = payload[prop];
    // console.log('Adding payload: ', payload[prop]);
  }

  global.NODE_docClient.putItem(formData, function(err, data) {
    if (!!err) {
      console.log('putStateItem: putItem failed: ', err);
    }
    if (!!callback)
      callback(err, data);
    else
      return({err: err || {}, data: data || {}});
  });
}

