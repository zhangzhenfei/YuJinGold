var express = require('express')
var router = express.Router()

const admin = require('../config/admin-config.js')
const createToken = require('../token/create-token.js')

router.post('/login', function(req, res, next) {
  var params = req.body
  const username = params.username
  const password = params.password
  if (username === admin.username && password === admin.password) {
    const token = createToken(username)
    console.log(token)
    res.json({
      success: true,
      username,
      token
    })
  } else {
    res.json({
      success: false
    })
  }
})

module.exports = router
