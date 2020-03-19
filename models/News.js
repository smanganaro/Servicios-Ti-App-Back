const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let News = new Schema({
	title:{
		type: String
	},
	subtitle:{
		type: String
	},
	body:{
		type: String
	},
	author:{
		type: String
	},
	date:{
		type: Date
	},
	/*img: { 
		data: Buffer,
		contentType: String
	}*/
});

module.exports = mongoose.model('News', News)