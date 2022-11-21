require('../config/config');
const express = require('express');
const app     = express();
const http    = require('http');
const https   = require('https');
const cors    = require('cors');
var { expressjwt: jwt } = require('express-jwt');
const routers = require('./routers');
const fs      = require('fs');
const path    = require('path');

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
                key  : fs.readFileSync(path.join(__dirname,'./cert/key.pem')),
                cert : fs.readFileSync(path.join(__dirname,'./cert/cert.pem')),
            },
            app
        )
        .listen(port,() => console.log(`Listening at https://ec2-18-225-33-135.us-east-2.compute.amazonaws.com:${port}`))

}else{

    http
        .createServer(app)
        .listen(port,() => console.log(`Listening at http://localhost:${port}`))

}