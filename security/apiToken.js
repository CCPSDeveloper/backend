var jwt = require('jsonwebtoken');
const fun = require('../config/jsonData');

function verifyToken(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token)
    return fun.unauth_status(res,'Failed to authenticate token');
    
  jwt.verify(token, process.env.API_SECRET, function(err, decoded) {
    if (err)
      return fun.unauth_status(res,'Failed to authenticate token');
      
    // if everything good, save to request for use in other routes
    req.id = decoded.id;
    next();
  });
}

module.exports = verifyToken;