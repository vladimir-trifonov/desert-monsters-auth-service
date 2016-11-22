var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userSchema = new Schema({	'name' : String,	'email' : String,	'avatar' : String,	'slackID' : String,	'githubID' : String,	'repos' : Array});

module.exports = mongoose.model('user', userSchema);
