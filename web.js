var botNames = ["@reachbot", "@laobot", "@fuckbot"];
var cmds = ["google", "scores", "ud", "joke", "giphy", "weather", "spotify"];
var bodyParser = require("body-parser");
var express = require("express");
var logfmt = require("logfmt");
var request = require('request');
var HashMap = require('hashmap').HashMap;
require('date-utils');
var app = express();

app.use(logfmt.requestLogger());
app.use(bodyParser());

// Handle GET request
app.get('/', function(req, res) {
	res.send('<html>\n'+
			'<head>\n'+
			'<title>#Reachlife</title>\n'+
			'</head>\n'+
			'<body>\n'+
			'\n'+
			'<h4>Hello, this bot is the property of #reachlife.</h4>\n'+
			'\n'+
			'<p>Bots: @reachbot, @laobot and @fuckbot</p>\n'+
			'\n'+
			'<code>\n'+
			'<pre>\n'+
			'	Supported commands:\n'+
			'\n'+
			'	Urban Dictionary term search:\n'+
			'		Command: {bot} ud {term}\n'+
			'		Example: @reachbot ud thot\n'+
			'\n'+
			'	Random joke:\n'+
			'		Command: {bot} joke\n'+
			'		Example: @reachbot joke\n'+
			'\n'+
			'	8Ball:\n'+
			'		Command: {bot} {question}?\n'+
			'		Example: @reachbot do you like me?\n'+
			'\n'+
			'	Giphy search image:\n'+
			'		Command: {bot} giphy {term}\n'+
			'		Example: @reachbot giphy molly\n'+
			'\n'+
			'	Weather:\n'+
			'		Command: {bot} weather {location}\n'+
			'		Example: @reachbot weather San Diego, CA\n'+
			'\n'+
			'	Spotify search tracks:\n'+
			'		Command: {bot} spotify {track}\n'+
			'		Example: @reachbot spotify Like A Prayer\n'+
			'</pre>\n'+
			'</code>\n'+
			'\n'+
			'</body>\n'+
			'</html>\n');
});

// Handle POST request
app.post('/receiver', function(req, res) {
	var fromUser = req.body.name;
	var message = req.body.text;
	var groupId = req.body.group_id;
	
	// Set botId
	var botId = "1b0a65dc0963428c4d1946d735"; // #reachlife
	if (groupId == "8592658") {
		botId = "6700b3625fa11e760d1a66460b"; // test group
	}
	else if (groupId == "7377546") {
		botId = "76bbaccc18e94074c8f7e3be3d"; // Daves group
	}
	
	if (message) {
		if (message.toLowerCase() == "i love you reachbot") {
			request.post('https://api.groupme.com/v3/bots/post', {form:{bot_id: botId,text: "I love you too "+fromUser+"?"}});
		}
		else {
			msgTokens = message.split(" ");
			if (msgTokens && msgTokens.length > 1) {
				var bot = msgTokens[0];
				if (botNames.indexOf(bot.toLowerCase()) > -1) {
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
						var term = "";
						for (var i = 2; i < msgTokens.length; i++) {
							term = term + " " + msgTokens[i];
						}
						console.log("term="+term.trim())
						var url = "http://api.urbandictionary.com/v0/define?term="+term

						request({
							url: url,
							json: true
						}, function (error, response, body) {
						    if (!error && response.statusCode === 200) {
						    	listItems = body.list;
						    	answer = "";
						    	if (listItems && listItems.length > 0) {
						    		listItem = listItems[0];
						    		answer = fromUser + ", " + term + " means '" + listItem.definition + "'.";
						    	}
						    	else {
						    		answer = fromUser + ", I couldnt find a definition on " + term +"."; 
						    	}
						    	request.post('https://api.groupme.com/v3/bots/post', {form:{bot_id: botId,text: answer}});
						    }
						});
					}
					// Joke
					else if (cmd.toLowerCase() == cmds[3]) {
						var url = "http://api.icndb.com/jokes/random";
						request({
							url: url,
							json: true
						}, function (error, response, body) {
						    if (!error && response.statusCode === 200) {
						    	request.post('https://api.groupme.com/v3/bots/post', {form:{bot_id: botId,text: body.value.joke}});
						    }
						});
					}
					// Giphy
					else if (cmd.toLowerCase() == cmds[4]) {
						var term = "";
						for (var i = 2; i < msgTokens.length; i++) {
							term = term + " " + msgTokens[i];
						}
						console.log("giphysearch="+term.trim())
						var url = "http://api.giphy.com/v1/gifs/search?q="+term+"&api_key=dc6zaTOxFJmzC";
						request({
							url: url,
							json: true
						}, function (error, response, body) {
						    if (!error && response.statusCode === 200) {
						    	var images = body.data;
						    	if (images) {
						    		// Get random image from result
							    	var randomIndex = Math.floor(Math.random() * images.length);
									var image = body.data[randomIndex];
							    	request.post('https://api.groupme.com/v3/bots/post', {form: { bot_id: botId, text: image.images.fixed_height.url } });
						    	}
						    	else {
						    		request.post('https://api.groupme.com/v3/bots/post', {form: { bot_id: botId, text: "Could not find any gifs "+fromUser+"." } });
						    	}
						    }
						});
					}
					// Weather
					else if (cmd.toLowerCase() == cmds[5]) {
						var location = "";
						for (var i = 2; i < msgTokens.length; i++) {
							location = location + " " + msgTokens[i];
						}
						console.log("location="+location.trim());
						var url = "http://api.openweathermap.org/data/2.5/weather?q="+location+"&units=imperial";
						request({
							url: url,
							json: true
						}, function (error, response, body) {
						    if (!error && response.statusCode === 200) {
						    	if (body.weather) {
						    		var weather = body.weather[0];
							    	var main = body.main;
							    	var temp = Math.floor(main.temp);
							    	var summary = temp + "° in " + body.name + ", " + weather.description;
							    	request.post('https://api.groupme.com/v3/bots/post', {form: { bot_id: botId, text: summary } });
						    	}
						    	else {
						    		request.post('https://api.groupme.com/v3/bots/post', {form: { bot_id: botId, text: "Could not find any weather info for that location "+fromUser+"."  } });
						    	}
						    }
						});
					}
					// Spotify
					else if (cmd.toLowerCase() == cmds[6]) {
						var track = "";
						for (var i = 2; i < msgTokens.length; i++) {
							track = track + " " + msgTokens[i];
						}
						console.log("track="+track.trim());
						var url = "https://api.spotify.com/v1/search?q="+track+"&type=track";
						request({
							url: url,
							json: true
						}, function (error, response, body) {
						    if (!error && response.statusCode === 200) {
						    	if (body.tracks.items) {
						    		var summary = ""
						    		console.log(body.tracks.items)
						    		var items = body.tracks.items;
						    		var limit = 3;
						    		for (var i = 0; i < items.length; i++) {
						    			if (i < limit) { break; }
						    			var item = items[i];
						    			summary = summary + item.name + " by " + item.artist[0].name + " - Preview: " + item.preview_url + " Listen: " + item.external_urls.spotify + "\n";
						    		}
							    	request.post('https://api.groupme.com/v3/bots/post', {form: { bot_id: botId, text: summary } });
						    	}
						    	else {
						    		request.post('https://api.groupme.com/v3/bots/post', {form: { bot_id: botId, text: "Could not find any info for that track "+fromUser+"."  } });
						    	}
						    }
						});
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
							
							var randomnumber = Math.floor(Math.random() * 23);
							randomMessage = messages[randomnumber];
							answer = fromUser + ", " + randomMessage;
							
							request.post('https://api.groupme.com/v3/bots/post', {form:{bot_id: botId,text: answer}});
						}
					}
				}
			}
			else if (msgTokens && msgTokens.length == 1) {
				var bot = msgTokens[0];
				if (botNames.indexOf(bot.toLowerCase()) > -1) {
					request.post('https://api.groupme.com/v3/bots/post', {form:{bot_id: botId,text: "Yeah, what's up "+fromUser+"?"}});
				}
			}
		}
	}
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
	console.log("Listening on " + port);
});
