var botNames = ["@reachbot", "@laobot", "@fuckbot"];
var cmds = ["google", "scores", "ud"];
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
	res.send('Hello, property of reachlife.');
});

// Handle POST request
app.post('/receiver', function(req, res) {
	var fromUser = req.body.name;
	var message = req.body.text;
	var groupId = req.body.group_id;
	var botId = (groupId == "8592658" ? "6700b3625fa11e760d1a66460b" : "1b0a65dc0963428c4d1946d735");
	
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
						var answer = "";
						var sport = msgTokens[2];
						var host = "http://api.espn.com";
						var queryParams = "?apiKey=foobar";
						var scoresPaths = new HashMap();
						scoresPaths.set("nhl","/v1/sports/hockey/nhl/events");
						scoresPaths.set("mlb","/v1/sports/baseball/mlb/events");
						scoresPaths.set("nfl","/v1/sports/football/nfl/events");
						scoresPaths.set("ncaaf","/v1/sports/football/college-football/events");
						scoresPaths.set("nba","/v1/sports/basketball/nba/events");
						scoresPaths.set("ncaab","/v1/sports/basketball/mens-college-basketball/events");
						scoresPaths.set("wnba","/v1/sports/basketball/wnba/events");
						scoresPaths.set("ncaaw","/v1/sports/basketball/womens-college-basketball/events");
						scoresPaths.set("wc2014","/v1/sports/soccer/fifa.world/events");
						
						var today = new Date();
						var todayParam = "&"+today.toFormat("YYYYMMDD");
						var advanceParam = "&advance=true";
						
						var path = scoresPaths.get(sport);
						if (path) {
							var url = host + path + queryParams + (sport == "wc2014" ? todayParam : advance);
							request(url, function (error, response, body) {
								if (!error && response.statusCode == 200) {
									jsonObj = JSON.parse(body);
									if (jsonObj) {
										var events = jsonObj.sports[0].leagues[0].events;
										if (events && events.length > 0) {
											var addComma = false;
											for (var i = 0; i < events.length; i++) {
												var gameInfo = "";
												var event = events[i].competitions[0];
												var status = event.status;
												var homeCompetitor = event.competitors[0];
												var awayCompetitor = event.competitors[1];
												if (status.state == "pre") {
													var detail = status.shortDetail;
													if (event.timeValid) {
														var date = new Date(status.shortDetail);
														dateStr = date.toFormat("DDD M/D H:MI PP");
														//dateStr = date.toString();
														gameInfo = dateStr + " - " + awayCompetitor.team.abbreviation + " @ " + homeCompetitor.team.abbreviation;
													}
													console.log(gameInfo)
												}
												else if (status.state == "in" || status.state == "post") {
													gameInfo = status.shortDetail + " - " + awayCompetitor.team.abbreviation + " (" + awayCompetitor.score + ") @ " + homeCompetitor.team.abbreviation + " (" + homeCompetitor.score + ")";
												}
												answer = answer + gameInfo + (i == events.length - 1 ? "" : ", ");
											}
										}
										else {
											answer = fromUser + ", no games scheduled right now.";
										}
									}
									else {
										answer = fromUser + ", something went wrong.... I need to go to the bathroom.";
									}
									request.post('https://api.groupme.com/v3/bots/post', {form:{bot_id: botId,text: answer}});
								}
							});
						} else {
							answer = fromUser + ", what's " + sport +"? I don't know the schedule for that shit."; 
							request.post('https://api.groupme.com/v3/bots/post', {form:{bot_id: botId,text: answer}});
						}
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
				if (bot.toLowerCase() == botName) {
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
