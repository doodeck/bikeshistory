// createTables.js
//
// create the required DynamoDB tables (if they do no exists)

// for the beginning it should be good enough just to create
// the tables from AWS console

var config = require('../../config');
var AWS = require('aws-sdk'); 
var dynamodb = new AWS.DynamoDB();

AWS.config.loadFromPath('./' + config.AWS.configFile);
AWS.config.region = config.AWS.region;

var params = {
  AttributeDefinitions: [
    { AttributeName: 'timestamp', AttributeType: 'N' }
  ],
  KeySchema: [
    { AttributeName: 'timestamp', KeyType: 'HASH' }
  ],
  ProvisionedThroughput: { /* required */
    ReadCapacityUnits: 23, /* required */
    WriteCapacityUnits: 23 /* required */
  },
  TableName: config.AWS.dynamoDBtable
};

dynamodb.createTable(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});

