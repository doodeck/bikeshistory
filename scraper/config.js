// config.js
//

var CONFIG = {
  // PORT: 5000, // traditionally written in capital letters
  scrapeInterval: 6000, // 86400000, // 60000,
  tmpDatabase:  false, // so far affecting FB only
  dbDriver: { // checkboxes, may write to multiple destinations at the same time, affects loggin only, exports are uncditional
  	mongoDB: false, // not implemented yet
  	firebase: false,
  	dynamoDB: true
  },
  AWS: {
  	configFile: 'credentials.aws.js',
  	region: 'eu-west-1',
    dynamoDBtable: 'bikeshistorytmp'
    }
};

// exports.config = CONFIG;
global.NODE_CONFIG = global.NODE_CONFIG ? global.NODE_CONFIG : CONFIG;

module.exports = global.NODE_CONFIG;

