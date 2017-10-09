
/*
- draw the canvas : search bar, enter button (html / css)
- user submits data, parse it in javascript

- send data to server
- server fetches info from spotify
- sends back data (the wall)

or

- send data to spotify from the client
- parse back result
- either show error or send data to server
- server updates walls of all users

overall limitations: 
no database! only tracks stuff when users are connected. 


*/

var socket;
var songInput;
var button;

const navID = "nav-bar"
const wallID = "wall";

function setup(){
	socket = io.connect('http://localhost:3000')
	songInput = createInput("");
	songInput.attribute("placeholder", "enter url of a spotify song");
	songInput.parent(navID);

	button = createButton("submit song");
	button.parent(navID);
	button.mousePressed(submitSong);

	socket.on('song', trackReceived)

}

function submitSong(){
	var trackID; 
	var incoming = songInput.value();
	console.log(songInput.value());
	var urlRegex = "https?:\/\/open.spotify.com\/track\/";
	if(match(incoming,urlRegex)){
		songInput.value("");
		//songInput.attribute("placeholder", "searching. you can add another");
		trackID = split(incoming, match(incoming,urlRegex)[0])[1];
		sendDataToSpotify(trackID);

	}
	else{
	 songInput.value("");
	 songInput.attribute("placeholder", "oops! try again please!");
	}
}

function sendDataToSpotify(theTrackID){
	socket.emit('trackID', theTrackID);
	// console.log(getRequestURL);
	// loadJSON(getRequestURL,trackReceived);
}

function trackReceived(data){
	   //  let data = {
    // 	songName: json.name,
    // 	link: json.external_urls.spotify,
    // 	artistName: json.artists[0].name
    // }

	let newLink = createA(data.link, data.songName + " - " + data.artistName, "_blank");
	newLink.parent(wallID);
	let lineBreak = createElement("br");
	lineBreak.parent(wallID);


}


function draw(){

}

/*
var socket;

function setup(){
    createCanvas(windowWidth,windowHeight);
    socket = io.connect('http://localhost:3000')
    background(100);
    socket.on('mouse', newDrawing);
}

function newDrawing(data){
	fill(0,255,0);
	ellipse(data.x, data.y, 60,60);
	console.log("this should draw")
}


function draw(){

}

function mouseDragged(){
	var data = {
		x: mouseX,
		y: mouseY
	}

	socket.emit('mouse', data);
	fill(255);
	ellipse(mouseX, mouseY, 60,60);

}

*/