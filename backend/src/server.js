const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');

const server = express();


//mongoose.connect('mongodb://omnistack:omnistack@cluster0-tgpwe.mongodb.net/test?retryWrites=true&w=majority', {
mongoose.connect('mongodb://localhost/omnistack', {
    useNewUrlParser: true
});

server.use(cors());
server.use(express.json());
server.use(routes);

// GET, POST, PUT, DELETE

server.listen(3333);