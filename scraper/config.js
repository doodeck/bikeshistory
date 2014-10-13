// config.js
//

var CONFIG = {
  // PORT: 5000, // traditionally written in capital letters
  scrapeInterval: 86400000, // 60000, // 86400000, // 60000,
  tmpDatabase: false,
  dbDriver: { // checkboxes, may write to multiple destinations at the same time
  	mongoDB: false,
  	firebase: true,
  	dynamoDB: false
  },
  AWS: {
  	configFile: 'credentials.aws.js',
  	region: 'eu-west-1',
    dynamoDBtable: 'bikeshistoryStates'
    }
};

// exports.config = CONFIG;
global.NODE_CONFIG = global.NODE_CONFIG ? global.NODE_CONFIG : CONFIG;

module.exports = global.NODE_CONFIG;

