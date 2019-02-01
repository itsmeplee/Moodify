const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser());



app.listen(port, () => {
    console.log('Listening on port: ', port)
})