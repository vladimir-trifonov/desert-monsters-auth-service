var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

var Thalassa = require('thalassa');

var jwt = require('jsonwebtoken');
var config = require('./config');

var port = process.env.PORT || 3000;
app.set('secret', config.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

var apiRoutes = express.Router();

apiRoutes.post('/authenticate', function (req, res) {
	var token = jwt.sign({
		username: "dev",
		password: "dev"
	}, app.get('secret'), {
			expiresIn: 86400 //24 hours
		});

	res.json({
		success: true,
		token: token
	});
});

apiRoutes.use(function (req, res, next) {
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	if (token) {
		jwt.verify(token, app.get('secret'), function (err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
});

apiRoutes.get('/check', function (req, res) {
	res.json(req.decoded);
});

app.use('/', apiRoutes);
app.listen(port, function () {
	var client = new Thalassa.Client({
		apiport: 7070,
		host: 'localhost',
		log: function (i, m) {
			console.log(m);
		}
	});

	client.register('desert-monsters-auth-service', '1.0.0', port);
	client.start();
});
console.log('Server listens at http://localhost:' + port);
