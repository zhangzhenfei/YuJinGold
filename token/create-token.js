var jwtConfig = require('../config/jwt-config')
var jwt = require('jsonwebtoken')

// 登录时：核对用户名和密码成功后，应用将用户的id（图中的user_id）作为JWT Payload的一个属性
// 创建token的场景： 1.用户刚注册完 2.登录成功时创建新的token
module.exports = function(userId) {
  var token = jwt.sign(
    {
      user_id: userId
    },
    jwtConfig.secret,
    {
      expiresIn: jwtConfig.exprisesIn
    }
  )
  return token
}
