// dbDynamo.js
//

var config = require('../../config');
var assert = require('assert');
var AWS = require('aws-sdk');
var DOC = require("../../lib/dynamodb-doc");
if (!config.AWS.usingLambda) {
  AWS.config.loadFromPath('./' + config.AWS.configFile);
}
// AWS.config.region = config.AWS.region;
AWS.config.update({region: config.AWS.region });
var tables = require('./createTables');
var putHashedItem, conditionalPutHashedItem; // function to save either state or fullState item
// memcache ... var latestPutItem = {};
var appendStateItemPeriod, appendFullItemPeriod;
var formDataToQuery;
var updateLatestPutItem, isEqualLatestPutItem, deepCompareItems;

appendFullItemPeriod = function(formData, callback) {
  formData.Item.period = "Full"; // ultimately it should be hashed with a tmestamp derivative as well, e.g. "Full-2014-11"
  callback(null, { formData: formData });
}

appendStateItemPeriod = function(formData, callback) {
  formData.Item.period = "State"; // ultimately it should be hashed with a tmestamp derivative as well, e.g. "State-2014-11"
  callback(null, { formData: formData });
}

// var dynamodb = new AWS.DynamoDB({region: config.AWS.region});
// var docClient = new DOC.DynamoDB(/*dynamodb*/);

// exports.config = CONFIG;
var docClient = global.NODE_docClient = global.NODE_docClient ? global.NODE_docClient : new DOC.DynamoDB(/*dynamodb*/);

// module.exports = global.NODE_docClient;
exports.docClient = global.NODE_docClient;


updateLatestPutItem = function(formData) {
  // memcache ... latestPutItem[formData.Item.period] = formData;
  // console.log('latestPutItem: ', JSON.stringify(latestPutItem));
}

formDataToQuery = function(formData) {
  var query = {
    TableName: formData.TableName,
    Key: formData.Item,
    ConsistentRead: true
  };
}

deepCompareItems = function (latest, incoming, callback) { // remember to ignore the timestamp before calling this function!
  var equal = true;
  // var timestamp = incoming.Item.timestamp;

  // console.log('Comparing: ', latest, ' against ', incoming);
  try {
    // incoming.Item.timestamp = latest.Item.timestamp;
    assert.deepEqual(latest, incoming);
  } catch(err) {
    // console.error('comparerr: ', err);
    equal = false;
  } finally {
    // console.log('compareally: ', equal);
    // incoming.Item.timestamp = timestamp;
    callback(null /*err*/, {equal: equal});
  }
}

isEqualLatestPutItem = function(formData, callback) {
  var latest = null; // memcache ... latestPutItem[formData.Item.period];

  if (!latest) {
    docClient.query({
        TableName: formData.TableName,
        KeyConditions:
            [docClient.Condition("period", "EQ", formData.Item.period)],
            // period: formData.Item.period
            // timestamp: formData.Item.timestamp
        ConsistentRead: true,
        ScanIndexForward: false,
        Limit: 1
    },
    function (err, data) {
        if (!!err || !data) {
            console.error('docClient query failed: ', err);
            callback(err, {equal: false});
        } else {
            if (!data.Count) {
                console.log('docClient query ok, but item not found');
                callback(null /*err*/, {equal: false});
            } else {
                var preservedTimestamp;
                /*
                console.log('docClient happily retrieved: ' + data.Items[0].timestamp.toString());
                console.log(data); // print the item data
                */
                latest = /*latestPutItem[formData.Item.period] =*/ {};
                latest.TableName = formData.TableName;
                latest.Item = data.Items[0];

                preservedTimestamp = latest.Item.timestamp; // TODO: do it nicer SVP
                latest.Item.timestamp = formData.Item.timestamp; // ignore timestamp by comparison
                deepCompareItems(latest, formData,
                  function(err, data) {
                    if (!!data && !!data.equal) {
                      latest.Item.timestamp = preservedTimestamp;
                      callback(err, {equal: data.equal, item: latest.Item});
                    } else
                      callback(err, {equal: data.equal}); // data.equal === false
                  });
            }
        }
    });
  } else { // not used now. waiting for memcache
    // timestamp = formData.Item.timestamp;
    // need here the code to ignore timestam comparison
    deepCompareItems(latest, formData, callback);
    // formData.Item.timestamp = timestamp;
  }
  // console.log('latestPutItem: ', JSON.stringify(latestPutItem));
}

exports.conditionalPutFullItem = function (payload, callback) { // put the item only if it's different from the latest put
  putHashedItem(appendFullItemPeriod, true, payload, callback);
}

exports.conditionalPutStateItem = function (payload, callback) { // put the item only if it's different from the latest put
  putHashedItem(appendStateItemPeriod, true, payload, callback);
}

exports.putStateItem = function(payload, callback) {
  putHashedItem(appendStateItemPeriod, false, payload, callback);
}

putHashedItem = function(appendCallback, conditional, payload, callback) {
  var doPutItem;
  var formData = {
    TableName: config.AWS.dynamoDBtable,
    Item: {
      // period: hash, take care by append callback
      timestamp: new Date().getTime()
    }
  };
  for (var prop in payload) {
    formData.Item[prop] = payload[prop];
    // console.log('Adding payload: ', payload[prop]);
  }

  appendCallback(formData, function(err, data) {
    if (!err) {
      doPutItem = function() {
        docClient.putItem(formData, function(err, data) {
          if (!!err) {
            console.log('putStateItem: putItem failed: ', err);
          } else {
  // isEqualLatestPutItem(formData);
            updateLatestPutItem(formData); // doing nothing, waiting for memcache
          }
          if (!!callback)
            callback(err, { item: formData.Item });
        });
      };

      if (!conditional) {
        doPutItem();
      } else {
        isEqualLatestPutItem(formData, function(err, data) {
          // debugger;
          if (!!err || !data || !data.equal)
            doPutItem();
          else
            callback(err, data);
        });
      }
    } else {
      console.error('putHashedItem: appendCallback(', appendCallback, ') failed');
      callback(err, data);
    }
  });
}

