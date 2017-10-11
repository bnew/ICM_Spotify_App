
var express = require('express');
var app = express();

// const cookieParser = require('cookie-parser');


var fetch = require('node-fetch');


var client_id = XXXXX; // Your client id
var client_secret = XXXXXX; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri
var request = require('request'); // "Request" library
let access_token = XXXXX;
let refresh_token = XXXXXX;

app.use(express.static('public'));
var server = app.listen(process.env.PORT || 3000);

console.log("My socket server is running")	


var socket = require('socket.io');
var io = socket(server);

let userCount = 0;

io.sockets.on('connection', newConnection);

function newConnection(socket){
	console.log("new connection: " + socket.id);
	socket.on('trackID', spotifyTrackQuery);
	function trackIDReceived(data){
	console.log(data);
}
}


function spotifyTrackQuery(trackID){
	let getRequestURL = ("https://api.spotify.com/v1/tracks/" + trackID + "?access_token=" + access_token) ; 
	console.log(getRequestURL);
	fetch(getRequestURL)
	.then(function(response){
    return response.json(); 
	}) 
	.then(function(json){
	try{
		if(json.external_urls.spotify)
	{
    console.log(json.name); // track name
    console.log(json.external_urls.spotify) //url
    console.log(json.artists[0].name) // artist name
    let data = {
    	songName: json.name,
    	link: json.external_urls.spotify,
    	artistName: json.artists[0].name
    }

    io.sockets.emit('song', data)
	}
		}
catch(e){
	console.log("fetching new token");
	//return message to client that errored?
	getNewToken(trackID);
}

	});
}


function getNewToken(trackID){
request.get('http://localhost:'+ process.env.PORT + '/refresh_token', function (error, response, body) {
  // console.log('error:', error); // Print the error if one occurred
  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //console.log(response);
  //console.log('access token', response.access_token); 
  //access_token = body.access_token;
  // console.log(body);
  spotifyTrackQuery(trackID);

	});
}

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  // var refresh_token = req.query.refresh_token;
  // console.log("refresh_token", refresh_token);
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      console.log(access_token);


      res.send({
      });
    }
  });
});

/*
function packageData(json){
	var info = {
		"name" : json.name,
		"url" : json.external_urls[0].spotify,

	}
}
*/

