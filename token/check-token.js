var jwt = require('jsonwebtoken')
var jwtConfig = require('../config/jwt-config')

module.exports = function(req, res, next) {
  var err = new Error('expired token')
  err.status = 401
  var authorization = req.get('authorization')
  if (authorization) {
    var token = authorization.split(' ')[1]
    try {
      var decoded = jwt.verify(token, jwtConfig.secret)
      var deadline = new Date() / 1000
      if (decoded.exp <= deadline) {
        console.log('expired token')
        next(err)
      } else {
        console.log('鉴权成功!')
        next()
      }
    } catch (err) {
      next(err)
    }
  } else {
    next(err)
  }
}
