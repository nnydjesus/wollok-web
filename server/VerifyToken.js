var jwt = require('jsonwebtoken');
var config = require('./jwtConfig');

function verifyToken(req, res, next) {

  var token = req.headers['authorization'];
  if (!token) 
    return res.status(401).send({ auth: false, type: 'notTokenProvider' });


  jwt.verify(token, config.secret, function(err, decoded) {      
    if (err) {
      return res.status(401).send({ auth: false, type: 'invalidToken' });    
    }
      
    req.username = decoded.username;
    next();
  });

}

module.exports = verifyToken;