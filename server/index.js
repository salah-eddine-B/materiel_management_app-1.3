const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require("dotenv").config();

const bodyParser = require('body-parser');

app.use(bodyParser.json());

const port = process.env.PORT || 3001;
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

//Read materiel data
let materielData = require('./data/materielData.json');

app.get("/materials", (req, res) => {
    console.log("hello from me");
    res.json(materielData);
});

server.listen(port, () => console.log("listening on port " + port));
