// config.js
//

var CONFIG = {
  // PORT: 5000, // traditionally written in capital letters
  scrapeInterval: 60000, // 86400000, // 60000,
  tmpDatabase: false,
  dbDriver: {
  	mongoDB: 'mongo',
  	firebase: 'fb',
  	dynamoDB: 'dynamo',
  	type: 'fb' // CONFIG.dbDriver.firebase
  }
};

// exports.config = CONFIG;
global.NODE_CONFIG = global.NODE_CONFIG ? global.NODE_CONFIG : CONFIG;

module.exports = global.NODE_CONFIG;

