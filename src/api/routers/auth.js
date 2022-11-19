const express = require('express');
const router = express.Router();

const AuthService = require('../../services/auth');

router.post('/',(req,res)=>{
    AuthService
        .doLogin(req)
        .then(response => {
            res.status(response.code).send(response.data)
        })
        .catch(err => {
            res.status(500).send();
        });
});

router.post('/',(req,res) => {
    AuthService
        .refreshToken(req)
        .then(response => {
            res.status(response.code).send(response.data)
        })
        .catch(err => {
            res.status(500).send();
        });
})

module.exports = router;