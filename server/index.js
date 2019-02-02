const express = require("express");
const axios = require("axios");
const request = require("request");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname + "/../client/dist"));

//key is available for only 7 days
const subscriptionKey = "5b10a5db469247c59121f3fc4752d4a3";
const uriBase =
  "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

const params = {
  returnFaceId: "true",
  returnFaceLandmarks: "false",
  returnFaceAttributes: "emotion"
};

app.post("/face", (req, res) => {
  let strongestEmotion = null;
  let highestEmotionValue = 0;
  const input = req.body.input;
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
    let jsonResponse = JSON.stringify(JSON.parse(body), null, "  ");
    let parsedBody = JSON.parse(body);
    let emotions = parsedBody[0]['faceAttributes']['emotion']
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