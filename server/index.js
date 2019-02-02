const express = require("express");
const axios = require("axios");
const request = require("request");
const bodyParser = require("body-parser");
const spotifycredentials = require("../spotifycredentials.js");
const Spotify = require("node-spotify-api");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname + "/../client/dist"));

var spotify = new Spotify({
  id: spotifycredentials.clientId,
  secret: spotifycredentials.clientSecret
});

app.post("/face", (req, res) => {
  let strongestEmotion = null;
  let highestEmotionValue = 0;
  const input = req.body.input;
  //subscription key is available for only 7 days
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

app.post("/search", (req, res) => {
  const emotion = req.body.emotion;
  spotify.search({type: 'playlist', query: emotion, limit: 10}, (err, data) => {
      if (err) {
          console.error('error searching spotify playlists: ', err);
      } else {
          console.log('this is the data: ', data);
          res.send(data)
      }
  })
});

app.listen(port, () => {
  console.log("Listening on port: ", port);
});
