require("dotenv").config();

var keys = require("./keys");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require("request");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var omdb = process.env.OMDB_KEY;


var cmdLine = process.argv.slice(2).join();
console.log(cmdLine);

if (cmdLine === "test") {
  searchMyTweets();
}

if (cmdLine === "test2") {
  spotifyThisSong();
}

if (cmdLine === "test3") {
  requestMovie();
}


function requestMovie(){
  request('http://www.omdbapi.com/?apikey=' + omdb + '&s=The+Lego+movie', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  // Print the response status code if a response was received
  console.log(JSON.parse(body).Search[0].Title);
});

}


function spotifyThisSong(){
  spotify.search(
    { 
      type: 'track', 
      query: "Ace of Base The Sign", 
      limit: 1
     }, 
    function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
   
  console.log(JSON.stringify(data.tracks.items[0].external_urls, null, 1));

  console.log(JSON.stringify(data.tracks.items[0].artists[0].name, null, 1));

  console.log(JSON.stringify(data.tracks.items[0].name, null, 1));
  
  // console.log(JSON.stringify((data[0].name + " " + data[0].external_urls.spotify + " " + data[0].name), null, 1)); 
  });
}


function searchMyTweets() {
  var params = {
    user_name: "Vinny_Destefano",
    count: 20
  };
  client.get("statuses/user_timeline", params, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      for (var i = 0; i < 20; i++) {
        console.log(JSON.stringify((tweets[i].text + ". Made at: " + tweets[i].created_at), null, 1));
      }
    }
  });
}
