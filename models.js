var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var userSchema = new Schema({
	name: String,
	sites: [{ type: Schema.Types.ObjectId, ref: 'Summary' }]
});

mongoose.model('User', userSchema);

var summarySchema = new Schema({
	summary: String,
	source: String,
	link: String,
	title: String,
	created: {type: Date, default: Date.now}
});

mongoose.model('Summary', summarySchema)