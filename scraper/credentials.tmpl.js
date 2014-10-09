// credentials.tmpl.js

var CREDENTIALS = {
        // change it to access creadential to your DB
	dbUrl = 'mongodb://user:password@******.mongolab.com:43170/bikeshistory';
	collection : {
		state: 'states',
		fullState: 'fullStates'
	}
};

// exports.config = CREDENTIALS;
global.NODE_CREDENTIALS = global.NODE_CREDENTIALS ? global.NODE_CREDENTIALS : CREDENTIALS;

module.exports = global.NODE_CREDENTIALS;
