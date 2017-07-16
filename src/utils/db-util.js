var Db = require('mongodb').Db
var Server = require('mongodb').Server

/* 数据库连接信息host,port,user,pwd */
var dbName = 'yujin-gold' // 数据库名称
var dbHost = '127.0.0.1' // 数据库地址 'mongo.duapp.com'
var dbPort = '27017' // 数据库端口 '8908'
var username = 'yujin-admin' // 用户AK
var password = 'yujin' // 用户SK

var db = new Db(dbName, new Server(dbHost, dbPort, {}), {
  w: 1
})

var open = function(callback) {
  db.open(function(err, db) {
    db.authenticate(username, password, function(err, result) {
      if (err) {
        db.close()
        console.log('Authenticate failed!')
        return
      } else {
        callback(result)
      }
    })
  })
}

module.exports = { db, open }
