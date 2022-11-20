// Express
const express = require('express');
const app     = express();

// Routers
const auth    = require('./auth');
const usuario = require('./usuario');
const blog    = require('./blog');

//Auth and user

app.use( '/auth'    , auth );
app.use( '/usuario' , usuario );

//Blog
app.use( '/blog' , blog);

module.exports = app;