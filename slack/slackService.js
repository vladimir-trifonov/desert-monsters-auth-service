var slackUtils = require('./utils.js');

module.exports = {
  getUserInfo: function (slackID) {
    return new Promise(function (resolve, reject) {
      slackUtils.getUserInfo(slackID, function (user) {
        resolve({
          name: user.real_name,
          email: user.profile.email,
          avatar: user.profile.image_192,
          slackID: slackID
        });
      });
    });
  }
}