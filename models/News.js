const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let News = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
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
	img: { 
		type: String
	}
}, {
	collection: 'news'
});

module.exports = mongoose.model('News', News)