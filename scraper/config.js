// config.js
//

var CONFIG = {
  // PORT: 5000, // traditionally written is capital letters
  scrapeInterval: 86400000, // 60000,
  tmpDatabase: true
};

// exports.config = CONFIG;
global.NODE_CONFIG = global.NODE_CONFIG ? global.NODE_CONFIG : CONFIG;

module.exports = global.NODE_CONFIG;

