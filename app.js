var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose');
var Thalassa = require('thalassa');

var config = require('./config');
var port = process.env.PORT || 4000;

var slackTerminal = require('slack-terminalize');
// Initialize slack client
slackTerminal.init(config.SLACK_TOKEN, {
}, {
		CONFIG_DIR: __dirname + '/slack/config',
		COMMAND_DIR: __dirname + '/slack/commands'
	});

mongoose.Promise = global.Promise;
mongoose.connect(config.database);

app.set('secret', config.secret);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// Init routes
require('./auth')(app);
app.use('/users', require('./user/userRoutes'));

app.listen(port, function () {
	 if (process.env.NODE_ENV === 'production') {
		var Thalassa = require('thalassa');
		var client = new Thalassa.Client({
			apiport: 80,
			host: process.env.SERVICE_REGISTRY,
			log: function (i, m) {
				console.log(m);
			}
		});

		client.register('desert-monsters-blog-service', '1.0.0', port, {
			url: process.env.HOST
		});
		client.start();
	}

	console.log('Server listens at port:' + port);
});
