require("dotenv").config();

var fs = require("fs");
var keys = require("./keys");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require("request");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var omdb = process.env.OMDB_KEY;

var cmdLine = process.argv.slice(2).join(" ");
var cmdLineTwo = process.argv.slice(3).join(" ");
console.log(cmdLine);
console.log(cmdLineTwo);

if (cmdLine.indexOf("my-tweets") >= 0) {
  searchMyTweets();
}

if (cmdLine.indexOf("spotify-this-song") >= 0) {
  spotifyThisSong(cmdLineTwo);
}

if (cmdLine.indexOf("movie-this") >= 0) {
  requestMovie(cmdLineTwo);
}

if (cmdLine.indexOf("do-what-it-says") >= 0) {
  readFileCommands();
}

function readFileCommands() {
  fs.readFile("./random.txt", "utf8", function(error, data) {
    if (error) {
      console.log(error);
    } else {
      var dataArr = data.split(",");

      dataArr.forEach(function(item, index) {
        if (item === "spotify-this-song") {
          var testIndex = index + 1;
          var newCommand = dataArr[testIndex];
          console.log(newCommand);
          spotifyThisSong(newCommand);
        }

        if (item === "movie-this") {
          var testIndex = index + 1;
          var newCommand = dataArr[testIndex];
          console.log(newCommand);
          requestMovie(newCommand);
        }
      });
    }
  });
}

function requestMovie(cmdLineTwo) {
  request(
    "http://www.omdbapi.com/?apikey=" + omdb + "&t=" + cmdLineTwo + "&plot",
    function(error, response, body) {
      console.log("error:", error); // Print the error if one occurred

      console.log(JSON.parse(body).Title);
      console.log(JSON.parse(body).Year);
      console.log(JSON.parse(body).Actors);
      console.log(JSON.parse(body).Plot);
      console.log(JSON.parse(body).imdbRating);
      console.log(JSON.parse(body).Metascore);
      console.log(JSON.parse(body).Ratings[0]);
      console.log(JSON.parse(body).Ratings[1]);
      console.log(JSON.parse(body).Ratings[2]);
    }
  );
}

function spotifyThisSong(cmdLineTwo) {
  if (cmdLineTwo === "") {
    spotify.search(
      {
        type: "track",
        query: "Ace of Base The Sign",
        limit: 1
      },
      function(err, data) {
        if (err) {
          return console.log("Error occurred: " + err);
        }

        console.log(
          JSON.stringify(data.tracks.items[0].external_urls, null, 1)
        );

        console.log(
          JSON.stringify(data.tracks.items[0].artists[0].name, null, 1)
        );

        console.log(JSON.stringify(data.tracks.items[0].name, null, 1));
      }
    );
  } else {
    spotify.search(
      {
        type: "track",
        query: cmdLineTwo,
        limit: 1
      },
      function(err, data) {
        if (err) {
          return console.log("Error occurred: " + err);
        }

        console.log(
          JSON.stringify(data.tracks.items[0].external_urls, null, 1)
        );

        console.log(
          JSON.stringify(data.tracks.items[0].artists[0].name, null, 1)
        );

        console.log(JSON.stringify(data.tracks.items[0].name, null, 1));
      }
    );
  }
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
        console.log(
          JSON.stringify(
            tweets[i].text + ". Made at: " + tweets[i].created_at,
            null,
            1
          )
        );
      }
    }
  });
}
