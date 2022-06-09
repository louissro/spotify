const express = require('express');
const serverless = require('serverless-http');

const app = express();

const router = express.Router();


router.get("/", (req, response) => {

    const request = require('request');

    const client_id = "843d903e70bc41a682232561cc28c9b4";
    const client_secret = "5ef6fa06f05b4976841dab8042286bd1";
    const refresh_token = "AQDwstACp2xYkrTV3BB2hYXFvez_46F3It59t-_NxM1On0PKYhDj-MaJ2rs9KFxFzD-eJqtWXMadLzTpgLjhojWWQgoFCW0tc95xVRI1eR77LeIF4B98JHI7O5MhChy7dg4";

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: { grant_type: 'refresh_token', refresh_token: refresh_token }
    };

    request.post(authOptions, function(error, res) {
        var header = { 'Authorization': 'Bearer ' + (JSON.parse(res.body)).access_token };
        var song_name, artist, song_url;
        request({ url: "https://api.spotify.com/v1/me/player/currently-playing?", headers: header }, function(error, res, body) {
            if((res.statusCode == 204) || JSON.parse(body).currently_playing_type != "track") {
                request({ url:"https://api.spotify.com/v1/me/player/recently-played?type=track&limit=1", headers: header }, function(error, res, body) {
                    var body_text = JSON.parse(body);
                    var track = body_text.items[0].track;
                    song_name = track.name;
                    artist = track.artists[0].name;
                    song_url = track.external_urls.spotify;
                    response.json({ "song_name": song_name, "artist": artist, "song_url": song_url });
                });
            } else {
                var body_text = JSON.parse(body);
                song_name = body_text.item.name;
                artist = (body_text.item.artists)[0].name;
                song_url = body_text.item.external_urls.spotify;
                response.json({ "song_name": song_name, "artist": artist, "song_url": song_url });
            }
        });

    });

});


app.use("/.netlify/functions/app", router);
module.exports.handler = serverless(app);