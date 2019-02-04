// Require Spotify keys from my .env file
require("dotenv").config();

// These are my required dependencies which are stored inside variables
const keys = require("./keys");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");

// User's inputs will be stored in these variables
let userChoice = process.argv[2];
let input = process.argv.slice(3).join(" "); // Concatenates the user's input and removes the first two items from the array

// Function to search for Artists' Events via Bands in Town API 
function concertSearch(input) {
    axios.get(`https://rest.bandsintown.com/artists/${input}/events?app_id=codingbootcamp`).then(
        function (response) {
            const eventDate = moment(response.data[0].datetime).format('MM/DD/YYYY');
            console.log(`Venue Name: ${response.data[0].venue.name}`+ 
            `\nVenue Location: ${response.data[0].venue.city}` + 
            `\nEvent Date: ${eventDate}` + 
            `\n*******************************************************************************************************`);
        }
    );
};

// Function to search for track information via Spotify API
function spotifySearch(input) {
    spotify.search({
            type: 'track',
            query: `${input}`,
            limit: 5
        })
        .then(function(response) {
            let output = response.tracks.items;
            output.forEach(function(songs) {
                const artistName = `Artist Name(s): ${songs.artists[0].name}`;
                const songName = `Track Name: ${songs.name}`;
                const previewURL = `Preview URL: ${songs.preview_url}`;
                const albumName = `Album Name: ${songs.album.name}`;
                console.log(artistName +
                    `\n${songName}` + 
                    `\n${previewURL}` + 
                    `\n${albumName}` + 
                    `\n*******************************************************************************************************`);
                
        });
    });
};

// Function to search for movie information via OMDb API
function movieSearch(input) {
    // If the user does not provide a movie name, then the app will display details from the movie "Mr. Nobody" by default.
    if (!input) {
        input = "Mr. Nobody";
        movieSearch(input);
    } else {
        // If the user provides a movie name, then run a request to the OMDB API using axios and log the results.
        axios.get(`http://www.omdbapi.com/?t=${input}&y=&plot=short&apikey=trilogy`).then(
            function (response) {
                console.log(`Movie Title: ${response.data.Title}` + 
                `\nYear Released: ${response.data.Year}` + 
                `\nRotten Tomatoes Rating: ${response.data.Ratings[1].Value}` + 
                `\nCountry Produced: ${response.data.Country}` + 
                `\nMovie Language: ${response.data.Language}` + 
                `\nMovie Plot: ${response.data.Plot}` + 
                `\nMovie Actors: ${response.data.Actors}` + 
                `\n*******************************************************************************************************`);
            }
        );
    }
};

// Function that reads what is in the "random.txt" file and logs the results accordingly.
function doWhatItSays() {
    // fs.readFile read what is in the the "random.txt" file and searches for the results accordingly.
    fs.readFile("random.txt", "utf8", function (err, data) {
        // If the search causes an error, then the error will be logged.
        if (err) {
            return console.log(err);
        }
        // console.log(data);

        // Added commas between index [0] and [1] so it's easier to read. (e.g. = spotify-this-song,"I Want it That Way").
        let dataArr = data.split(",");

        // These variables will store the redisplayed content.
        let userChoice = dataArr[0];
        let input = dataArr[1];

        function doSearch() {
            if (userChoice === "concert-this") {
                concertSearch(input);
            } else if (userChoice === "spotify-this-song") {
                spotifySearch(input);
            } else if (userChoice === "movie-this") {
                movieSearch(input);
            }
        }
        doSearch();
    });
};

// This function will run the correct function based on the user's choice.
function commandLiri() {
    if (userChoice === "concert-this") {
        concertSearch(input);
    } else if (userChoice === "spotify-this-song") {
        if (input) {
            spotifySearch(input);
        } else {
            input = "The Sign by ace of base";
            spotifySearch(input);
        }
    } else if (userChoice === "movie-this") {
        movieSearch(input);
    } else if (userChoice === "do-what-it-says") {
        doWhatItSays();
    } else {
        console.log(`Thank you for checking out my LIRI Node application.  Please start by typing "node liri.js" into the command line and then enter any of the commands below:
        \n concert-this "name of an artist"
        \n spotify-this-song "name of a song"
        \n movie-this "name of a movie"
        \n "do-what-it-says"`); // this command will run whatever is in the "random.txt" file
    }
};

// Call on the commandLiri function so the app can run
commandLiri();