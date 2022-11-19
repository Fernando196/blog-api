// Express
const express = require('express');
const app     = express();

// Routers
const auth    = require('./auth');
const usuario = require('./usuario');

app.use( '/auth'    , auth );
app.use( '/usuario' , usuario );

module.exports = app;

