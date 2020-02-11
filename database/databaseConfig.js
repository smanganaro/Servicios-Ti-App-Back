let path = require('path');

let config = {
	centreon2_storage: {
		user: 'integracion',
		password: 'password',
		host: '192.168.1.97',
		port: 3306,
		database: 'centreon2_storage'
	},
	centreon2: {
		user: 'integracion',
		password: 'password',
		host: '192.168.1.97',
		port: 3306,
		database: 'centreon2'
	}
}

module.exports = config;