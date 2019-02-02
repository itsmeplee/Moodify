const express = require("express");
const axios = require("axios");
const request = require("request");
const bodyParser = require("body-parser");
const spotifycredentials = require('../spotifycredentials.js')

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname + "/../client/dist"));

var client_id = spotifycredentials.clientId; // Your client id
var client_secret = spotifycredentials.clientSecret; // Your secret

// your application requests authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

//accesses spotify API
request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {

    // use the access token to access the Spotify Web API
    var token = body.access_token;
    var options = {
      url: 'https://api.spotify.com/v1/users/m4sm12t7iypz8vih14eami7hw',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    request.get(options, function(error, response, body) {
      console.log(body);
    });
  }
});

app.post("/face", (req, res) => {
  let strongestEmotion = null;
  let highestEmotionValue = 0;
  const input = req.body.input;
  //key is available for only 7 days
  const subscriptionKey = "5b10a5db469247c59121f3fc4752d4a3";
  const uriBase =
    "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

  const params = {
    returnFaceId: "true",
    returnFaceLandmarks: "false",
    returnFaceAttributes: "emotion"
  };
  const options = {
    uri: uriBase,
    qs: params,
    body: '{"url": ' + '"' + input + '"}',
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": subscriptionKey
    }
  };
  request.post(options, (error, response, body) => {
    if (error) {
      console.log("Error: ", error);
      return;
    }
    let parsedBody = JSON.parse(body);
    let emotions = parsedBody[0]["faceAttributes"]["emotion"];
    for (var key in emotions) {
      if (emotions[key] > highestEmotionValue) {
        highestEmotionValue = emotions[key];
        strongestEmotion = key;
      }
    }
    res.send(strongestEmotion);
  });
});

app.listen(port, () => {
  console.log("Listening on port: ", port);
});
