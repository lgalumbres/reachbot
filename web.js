var botName = "reachbot";
var cmds = [".google", ".scores", ".ud"]
var bodyParser = require("body-parser");
var express = require("express");
var logfmt = require("logfmt");
var request = require('request');
var app = express();

app.use(logfmt.requestLogger());
app.use(bodyParser());

// Handle GET request
app.get('/', function(req, res) {
	res.send('Hello, I am the reachbot.');
});

// Handle POST request
app.post('/receiver', function(req, res) {
	var fromUser = req.body.name;
	var message = req.body.text;
	var groupId = req.body.group_id;
	
	var botId = (groupId == "8592658" ? "6700b3625fa11e760d1a66460b" : "1b0a65dc0963428c4d1946d735");
	
	if (message) {
		msgTokens = message.split(" ");
		if (msgTokens && msgTokens.length > 1) {
			var bot = msgTokens[0];
			if (bot.toLowerCase() == botName) {
				var cmd = msgTokens[1];
				var lastToken = msgTokens[msgTokens.length - 1];
				// Google search
				if (cmd.toLowerCase() == cmds[0]) { 
					
				} 
				// Scores query
				else if (cmd.toLowerCase() == cmds[1]) {
					
				}
				// Urban Dictionary search
				else if (cmd.toLowerCase() == cmds[2]) {
					
				}
				// Magic 8 Ball
				else {
					if (lastToken.indexOf("?") > -1) {
						var messages = new Array();
						messages[0] = "no.";
						messages[1] = "not today.";
						messages[2] = "it is decidedly so.";
						messages[3] = "without a doubt.";
						messages[4] = "yes definitely.";
						messages[5] = "you may rely on it.";
						messages[6] = "as I see it yes.";
						messages[7] = "most likely.";
						messages[8] = "outlook good.";
						messages[10] = "signs point to yes.";
						messages[11] = "reply hazy try again.";
						messages[12] = "ask again later.";
						messages[13] = "better not tell you now.";
						messages[14] = "cannot predict now.";
						messages[15] = "concentrate and ask again.";
						messages[16] = "don't count on it.";
						messages[17] = "my reply is no.";
						messages[18] = "my sources say no.";
						messages[19] = "outlook not so good.";
						messages[20] = "very doubtful.";
						messages[21] = "fuck John Cho!";
						messages[22] = "yaasss!";
						messages[23] = "one less lonely negroll....";
						
						var randomnumber = Math.floor(Math.random() * 24);
						randomMessage = messages[randomnumber];
						answer = fromUser + ", " + randomMessage;
						
						request.post('https://api.groupme.com/v3/bots/post', {form:{bot_id: botId,text: answer}});
					}
				}
			}
		}
	}
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
	console.log("Listening on " + port);
});
