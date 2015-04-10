var Slack = require('slack-client');

var token = 'xoxb-4403717633-mKEgxLGIiFDXzW0fPlePkZSi';
var autoReconnect = true;
var autoMark = true;

var slack = new Slack(token, autoReconnect, autoMark);

slack.on('open', function() {
  var channels = Object.keys(slack.channels)
    .map(function(k) { return slack.channels[k]; })
    .filter(function(c) { return c.is_member; })
    .map(function(g) { return g.name; });

  var groups = Object.keys(slack.groups)
    .map(function(k) { return slack.groups[k]; })
    .filter(function(g) { return g.is_open && !g.is_archived; })
    .map(function(g) { return g.name; });

  console.log('Welcome to Slack. You are ' + slack.self.name + 'of' + slack.team.name);

  if(channels.length > 0) {
    console.log('You are in: ' + channels.join(', '));
  }
  else {
    console.log('You are not in any channels.');
  }

  if(groups.length > 0) {
    console.log('As well as: ' + groups.join(', '));
  }
});

slack.on('message', function(message){
  var channel = slack.getChannelGroupOrDMByID(message.channel);
  var user = slack.getUserByID(message.user);
  var response = ''

  var type = message.type;
  var ts = message.ts;
  var text = message.text;

  var channelName = (channel != null ? channel.is_channel : void 0) ? '#' : '';
  channelName = channelName + (channel ? channel.name: 'UNKNOWN_CHANNEL');


  var userName = (user != null ? user.name : void 0) != null ? "@" + user.name : "UNKNOWN_USER";

  console.log("Received: " + type + " " + channelName + " " + userName + " " + ts + " \"" + text + "\"");

  if (type == 'message') {
    channel.send("Hi " + userName);
  }
});

slack.on('error', function(error){
  console.error("Error: " + error);
});

slack.login();
