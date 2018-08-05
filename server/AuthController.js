var express = require('express');
var router = express.Router();
var fs = require('fs');
var VerifyToken = require('./VerifyToken');
var users = {nnydjesus: {username:"nnydjesus", password:"$2a$08$TcXwTUd/AaScMvUAb7vUgukiYrBocOb1j2NIyvwG0VPwpnEi5WkD2"}}

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('./jwtConfig'); // get config file

router.post('/login', function(req, res) {
    var user = users[req.body.username]
    if(user){
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    
        // if user is found and password is valid
        // create a token
        var token = jwt.sign({ username: user.username }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });
    
        // return the information including token as JSON
        res.status(200).send({ auth: true, token: token });
    }else{
        res.status(401).send(JSON.stringify({type:"invalidCredentials"}));
    }

});

router.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

router.post('/register', function(req, res) {
    var username = req.body.username
    if(users[username]){
        return res.status(404).send("There was a problem registering the user`.");
    }

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    users[username] = {
        username: username,
        password : hashedPassword    
    }
    var token = jwt.sign({ username: username }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
    });

    fs.mkdir("./projects/"+username, function(e){
        console.log(e)
    })
  
    res.status(200).send({ auth: true, token: token });

});

router.get('/me', VerifyToken, function(req, res, next) {
    var user = users[req.body.username]
    if(user){
        res.status(200).send(user);
    }else{
        res.status(404).send('User Not Found');
    }
});

module.exports = router;