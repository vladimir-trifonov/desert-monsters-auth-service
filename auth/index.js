var express = require('express');
var userService = require('../user/userService.js');
var slackService = require('../slack/slackService');

module.exports = function (app) {
  var apiRoutes = express.Router();

  apiRoutes.post('/authenticate', function (req, res) {
    userService.findBySlackID( req.body.slack_id, function (err, user) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }

      new Promise(function (resolve, reject) {
        if(!user) {
          return slackService.getUserInfo(req.body.slack_id)
            .then(userService.createUser);
        }

        resolve(user);
      })
      .then(function(user) {
        var token = jwt.sign({
          id: user.id,
          name: user.name,
          email : user.email,
	        avatar : user.avatar
        }, app.get('secret'), {
            expiresIn: 86400 //24 hours
          });

        res.json({
          ok: true,
          token: token
        });
      })
      .catch(function (err) {
        console.log(err);
        res.sendStatus(500);
      });
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

  // Init auth routes
  app.use('/', apiRoutes);
}
