module.exports = require('./bot').Bot;


var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
}).listen(process.env.VMC_APP_PORT || 1337, null);

var request = require('request');

var Bot    = require('./index');
var AUTH   = 'hTGyIxvcONyYxOJffCXGZdSX';
var USERID = '5100d856aaa5cd69d63f1615';
var ROOMID = '50c8f604eb35c10e387daba0';

var bot = new Bot(AUTH, USERID, ROOMID);

var lastTalk = 0;

bot.on('speak', function(data) {

	lastTalk = Date.now();

	var text = data.text;
	if (text.match(/^\/standdown$/)) {
		bot.speak('Okay, fine, @'+data.name+'. Sheesh.');
		bot.remDj(USERID);
	}
	
	if(text.match(/^\/standup$/)) {
		bot.addDj();
	}
	
	if(text.match(/^\/dance$/)) {
		bot.speak("\\_0_\\");
		bot.speak("|_0_|");
		bot.speak("/_0_/");
		bot.speak("|_0_|");
		bot.speak("\\_0_\\");
	}
	
	if(text.match(/^\/makemeasandwich$/)) {
		bot.speak("No, @"+data.name+".");
	}
	
	
	if(text.match(/^\/bootindy$/)) {

		bot.speak("No, @"+data.name+", that would be fascist.");
		setTimeout(function() {
			bot.speak("Meh, what the heck. I'll boot 'im anyway.");
			bot.remDj('50d131eceb35c15b38fa5ac5');
		}, 5000);

	}
	
	
	if(text.match(/^\/bootleeann$/)) {

		bot.speak("No, @"+data.name+", that would be fascist.");
		setTimeout(function() {
			bot.speak("Meh, what the heck. I'll boot 'er anyway.");
			bot.remDj('50c7bb16aaa5cd20abf74d8c');
		}, 5000);

	}


	if( hasBogert(text) && ( text.contains('sucks') || text.contains('stink') || text.contains('smell') || text.contains('lame') || text.contains('lousy') || text.contains('hate') ) ) {
		var randText = [
			"Not cool, @"+data.name+". Not cool.",
			"That's kind of offensive, @"+data.name+".",
			"Um... really, @"+data.name+"? Really?",
			"You don't have better things to do than mess with a bot?",
			"[BogertBot Offended]"
		];
		bot.speak( randText[Math.floor((Math.random() * 4) + 1)] );
	}

	if( hasBogert(text) && ( text.contains('awesome') || text.contains('rock') || text.contains('cool') || text.contains('nice') || text.contains('love') ) ) {
		var randText = [
			"Thanks, @"+data.name+"!",
			"And I have good taste, too!",
			"You got it, @"+data.name+".",
			"You don't have better things to do than talk to a bot?",
			"[BogertBot Happy]"
		];
		bot.speak( randText[Math.floor((Math.random() * 4) + 1)] );
	}

	if( data.name === 'ScootyB' && ( text.contains('ugh') || text.contains('Ugh') || text.contains('heavens') || text.contains('Heavens') ) ) {
		bot.speak( "Indy gets booted every time he complains about one of my songs." );
		bot.remDj(data.userid);
	}
	
	if ( data.name === 'koschei' && text.contains('/crash') ) {
		bot.speak("Goodbye, all!");
		bot.remDj(USERID);
		process.exit(1);
	}
	
	/*
	if( text.contains('/tweet') ) {
		console.log('Making request.');
		request({
			uri : 'http://api.twitter.com/1/statuses/user_timeline.json?count=20&include_rts=false&exclude_replies=true&screen_name=akbogert',
			json : true
		}, function(error, response, body) {
			if (!error && response.statusCode == 200) {
			
				var intro = [
					"Want to hear something funny, @" + data.name+"? ",
					"Want to hear a cool story, @" + data.name+"? ",
					"Hey, @" + data.name+", I was just thinking - ",
					"Yo, @" + data.name+", the other day I noticed - ",
					"Hey, @" + data.name+", I was just thinking - "
				];
			
				console.log( body );
			
				var rand = body[Math.floor(Math.random() * body.length)];
			
				bot.speak( intro[getRandomInt(1, 4)] + rand.text );
				
			}
		});
	}
	*/
	
	if( text.contains('/bootbogert') ) {
		bot.speak('Now I am become death, destroyer of worlds!');
	}

});


bot.on('registered', function(data) {
	
	if( data.user[0].name != 'BogertBot' ) {
		
		var name = data.user[0].name;

		var randText = [
			"Hey there, @"+name+"!",
			"Ahoy, @"+name+"!",
			"G'day, @"+name+"!",
			"Howdy, @"+name+"!",
			"Well well well, if it isn't @"+name+"!"
		];
	
		bot.speak( randText[Math.floor((Math.random()*4)+1)] );
	
	}
	
});


bot.on('roomChanged', function(data) {
	setTimeout(function() {
		var djs = data.room.metadata.djs;
		if( djs.length < 1 ) {
			bot.speak("There's nobody DJing. I think I'll play something.");
			bot.addDj();
		}
	}, 150);
});


bot.on('nosong', function(data) {
	setTimeout(function() { bot.addDj(); }, 150);
});

var mySong = false;
bot.on('newsong', function(data) {
	
	setTimeout(function() { bot.bop(); }, 1000);
	
	var currentDj = data.room.currentdj;
	if( currentDj = USERID ) {
		mySong = true;
		console.log('I am playing a song.');
	}
	
	
	var timeSinceTalk = Date.now() - lastTalk;
	if( timeSinceTalk >= 3000000 ) {
		
		console.log('Making request.');
		request({
			uri : 'http://api.twitter.com/1/statuses/user_timeline.json?count=30&include_rts=false&exclude_replies=true&screen_name=akbogert',
			json : true
		}, function(error, response, body) {
			if (!error && response.statusCode == 200) {
			
				var intro = [
					"Want to hear something funny? ",
					"Want to hear a cool story? ",
					"Hey, I was just thinking - ",
					"Ima let you finish, but ",
					"So the other day I noticed something: "
				];
			
				console.log( body );
			
				var rand = body[Math.floor(Math.random() * body.length)];
			
				bot.speak( intro[getRandomInt(1, 4)] + rand.text );
				
			}
		});
		
		lastTalk = 0;
	}
	
	console.log(data);
});


bot.on('endsong', function(data) {
	if( data.room.current_dj == USERID ) {
		mySong = false;
		console.log('My song stopped playing.');
	}
});


function hasBogert(text) {
	if( text.contains('@BogertBot') || text.contains('@bogertbot') || text.contains('Bogert') || text.contains('bogert') ) { return true; }
	else { return false; }
}


function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


if (typeof String.prototype.contains === 'undefined') { String.prototype.contains = function(it) { return this.indexOf(it) != -1; }; }