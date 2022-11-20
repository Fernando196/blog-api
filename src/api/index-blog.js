require('../config/config');
const express = require('express');
const app     = express();
const http    = require('http');
const https   = require('https');
const cors    = require('cors');
var { expressjwt: jwt } = require('express-jwt');
const routers = require('./routers');

let unprotected = [
    '/api/auth/',
    '/api/usuario/registro'
]

app.use(express.json());
app.use(cors());
app.use(
    jwt({
        secret: process.env.SEED_API_BLOG,
        algorithms: [ "HS256" ],
        requestProperty: 'userData'
    }).unless({
        path: unprotected
    })
);

app.use('/api',routers); //Routers

const port = process.env.PORT;

if( process.env.NODE_ENV === 'production' ){

    https
        .createServer(
            {
                key: '',
                cert: '',
                ca: ''
            },
            app
        )
        .listen(port,() => console.log(`Listening at http://localhost:${port}`))

}else{

    http
        .createServer(app)
        .listen(port,() => console.log(`Listening at http://localhost:${port}`))

}