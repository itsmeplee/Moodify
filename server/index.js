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
// const imageUrl =
//   "https://upload.wikimedia.org/wikipedia/commons/3/37/Dagestani_man_and_woman.jpg";

const params = {
  returnFaceId: "true",
  returnFaceLandmarks: "false",
  returnFaceAttributes: "emotion"
};

app.post("/face", (req, res) => {
  //do the request post within here after changing the url to the req.body
  const input = req.body.input;
  console.log('this is the input: ', input)
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
    console.log("JSON Response\n");
    console.log(jsonResponse);
    console.log('this is the body \n', body)
  });
});

app.listen(port, () => {
  console.log("Listening on port: ", port);
});
