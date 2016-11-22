var userModel = require('./userModel.js');

module.exports = {
  findBySlackID: function (slackID) {
    return new Promise(function (resolve, reject) {
      userModel.findOne({ slackID: slackID }, function (err, user) {
        if (err) {
          return reject({
            message: 'Error when getting user.',
            error: err
          });
        }
        resolve(user);
      });
    });
  },
  createUser: function (userInfo) {
    return new Promise(function (resolve, reject) {
      var user = new userModel(userInfo);

      user.save(function (err, user) {
        if (err) {
          return reject({
            message: 'Error when creating user',
            error: err
          });
        }
        return resolve(user);
      });
    });
  }
}