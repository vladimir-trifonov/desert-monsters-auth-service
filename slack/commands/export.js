// Defines slack bot's export option. In order to use it type in slack '/msg @{botsName} export {@usernameToBeingExported}

var slackUtils = require('../utils.js');

// Auto called by slack-terminalize pkg
module.exports = function (param) {
    var usernames = param.args;

    // Test the received params from slack
    // If the received params are not in the format '<@{username}>' 
    // the slack client will display err msg in slack!
    if (!usernames || !usernames.length || !/^<@(.+)>$/.test(usernames[0])) {
        return slackUtils.postMessage(param.channel, 'Missing or wrong username!');
    }

    // Extract the username
    var usernameParsed = usernames[0].match(/^<@(.+)>$/)[1];

    // Send request to slack in order to receive user's information
    slackUtils.getUserInfo(usernameParsed, function (user) {});
};