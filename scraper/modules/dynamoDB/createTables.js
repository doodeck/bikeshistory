// createTables.js
//
// create the required DynamoDB tables (if they do no exists)

// for the beginning it should be good enough just to create
// the tables from AWS console

var config = require('../../config');
var AWS = require('aws-sdk'); 
var dynamodb = new AWS.DynamoDB();

if (!config.AWS.usingLambda) {
  AWS.config.loadFromPath('./' + config.AWS.configFile);
}
AWS.config.region = config.AWS.region;

/* check that:
http://serverfault.com/questions/424549/using-dynamodb-for-logging-user-activity

According to http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/QueryAndScan.html
Query results are always sorted by the range key. If the data type of the range key is Number, the results are returned in numeric order; otherwise, the results are returned in order of ASCII character code values. By default, the sort order is ascending. To reverse the order, set the ScanIndexForward parameter to false.
*/
if (!config.AWS.usingLambda) {
  var params = {
    AttributeDefinitions: [
      { AttributeName: 'period', AttributeType: 'S' }, // e.g. '2014-10'
      { AttributeName: 'timestamp', AttributeType: 'N' }
    ],
    KeySchema: [
      { AttributeName: 'period', KeyType: 'HASH' },
      { AttributeName: 'timestamp', KeyType: 'RANGE' }
    ],
    ProvisionedThroughput: { /* required */
      ReadCapacityUnits: 12, /* required */
      WriteCapacityUnits: 12 /* required */
    },
    TableName: config.AWS.dynamoDBtable
  };

  dynamodb.createTable(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}
