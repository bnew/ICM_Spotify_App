
var express = require('express');
var app = express();
var server = app.listen(3000);

var fetch = require('node-fetch');

app.use(express.static('public'));


console.log("My socket server is running")	


var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket){
	console.log("new connection: " + socket.id);
	socket.on('trackID', spotifyTrackQuery);
	function trackIDReceived(data){
	console.log(data);
}
}


function spotifyTrackQuery(trackID){
	let access_token = XXXXXX //hidden for purposes of sharing code.
	console.log(getRequestURL);
	fetch(getRequestURL)
	.then(function(response){
    return response.json(); 
	}) 
	.then(function(json){
    console.log(json.name); // track name
    console.log(json.external_urls.spotify) //url
    console.log(json.artists[0].name) // artist name
    let data = {
    	songName: json.name,
    	link: json.external_urls.spotify,
    	artistName: json.artists[0].name
    }

    io.sockets.emit('song', data)

	});
}

/*
function packageData(json){
	var info = {
		"name" : json.name,
		"url" : json.external_urls[0].spotify,

	}
}
*/

