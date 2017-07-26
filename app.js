var express = require('express')
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var app = express()

// uncomment after placing your favicon in /public
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
// 直接将vue打包的dist目录作为静态目录渲染
app.use(express.static(path.join(__dirname, 'dist')))

// 跨域允许所有来源请求，具体权限在oauth里面处理

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
  )
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  if (req.method === 'OPTIONS') {
    res.status(204).json({ data: 'option method return' })
  } else {
    next()
  }
})

// 登录
var auth = require('./routes/auth')
app.use('/auth', auth)

// 提供页面api调用
var viewMarketCenter = require('./routes/market-center')
app.use('/view/market-center', viewMarketCenter)

var checkToken = require('./token/check-token')
app.use(checkToken)

// 提供后台管理服务调用
var adminMarketCenter = require('./routes/market-center')
app.use('/admin/market-center', adminMarketCenter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.json({
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.send('授权失败，请登录！')
})

module.exports = app
