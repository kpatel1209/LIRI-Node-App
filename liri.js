// Require Spotify keys from my .env file
require("dotenv").config();

// Required dependencies and stored them inside variables
const keys = require("./keys");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");

// User's inputs will be stored in these variables
let userChoice = process.argv[2];
let value = process.argv.slice(3).join(" ");

// Function to search for Artists' Events via Bands in Town API 
function concertSearch(value) {
    axios.get(`https://rest.bandsintown.com/artists/${value}/events?app_id=codingbootcamp`).then(
        function (response) {
            const eventDate = moment(response.data[0].datetime).format('MM/DD/YYYY');
            console.log(`Venue Name: ${response.data[0].venue.name}`+ 
            `\nVenue Location: ${response.data[0].venue.city}` + 
            `\nEvent Date: ${eventDate}` + 
            `\n**********************************************************************`);
        }
    );
};

// Function to search for track information via Spotify API
function spotifySearch(entry) {
    spotify.search({
            type: 'track',
            query: `${entry}`,
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
                    `\n**********************************************************************`);
        });
    });
};

// Function to search for movie information via OMDb API
function movieSearch(entry) {
    // If the user does not provide a movie name, then the app will display details from the movie "Mr. Nobody" by default.
    if (!entry) {
        entry = "Mr. Nobody";
        movieSearch(entry);
    } else {
        // If the user provides a movie name, then run a request to the OMDB API using axios and log the results.
        axios.get(`http://www.omdbapi.com/?t=${entry}&y=&plot=short&apikey=trilogy`).then(
            function (response) {
                console.log(`Movie Title: ${response.data.Title}` + 
                `\nYear Released: ${response.data.Year}` + 
                `\nRotten Tomatoes Rating: ${response.data.Ratings[1].Value}` + 
                `\nCountry Produced: ${response.data.Country}` + 
                `\nMovie Language: ${response.data.Language}` + 
                `\nMovie Plot: ${response.data.Plot}` + 
                `\nMovie Actors: ${response.data.Actors}` + 
                `\n**********************************************************************`);
            }
        );
    }
};

// Function to run a random search for whatever is written in our random.txt file
function doWhatItSays() {
    // Use fs to read the random.txt file and run the search
    fs.readFile("random.txt", "utf8", function (error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }
        // We will then run the search
        console.log(data);

        // Then split it by commas (to make it more readable)
        let dataArr = data.split(",");

        // We will then re-display the content as an array for later use.
        let userChoice = dataArr[0];
        let value = dataArr[1];

        function doSearch() {
            if (userChoice === "concert-this") {
                concertSearch(value);
            } else if (userChoice === "spotify-this-song") {
                spotifySearch(value);
            } else if (userChoice === "movie-this") {
                movieSearch(value);
            }
        }
        doSearch();
    });
};

// Main function that runs the other functions based on user input
function commandLiri() {
    if (userChoice === "concert-this") {
        concertSearch(value);
    } else if (userChoice === "spotify-this-song") {
        if (value) {
            spotifySearch(value);
        } else {
            value = "The sign by ace of base";
            spotifySearch(value);
        }
    } else if (userChoice === "movie-this") {
        movieSearch(value);
    } else if (userChoice === "do-what-it-says") {
        doWhatItSays();
    } else {
        console.log(
            `First type "node liri.js" followed by any of these commands: 
        \n concert-this "the name of an artist who is touring"
        \n spotify-this-song "any song title"
        \n movie-this "any movie title"
        \n "do-what-it-says"`);
    }
};

// Calling the main LIRI search function to begin the app
commandLiri();