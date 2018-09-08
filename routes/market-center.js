var fs = require('fs')
var path = require('path')
var express = require('express')
var router = express.Router()
var axios = require('axios')
var marketCenterDB = require('../db/lowdb')

router.post('/fetchSources', function(req, res, next) {
  axios.get('http://120.25.103.3/NewHtjApi').then(function(data) {
    res.json(data.data)
  })
})

/* GET users listing. */
router.post('/saveOrUpdate', function(req, res, next) {
  var params = req.body
  marketCenterDB.saveOrUpdate(params).then(function(result) {
    res.json({ success: result.result.ok === 1 })
  })
})

router.post('/find', function(req, res, next) {
  var params = req.body
  marketCenterDB.find(params).then(function(result) {
    res.json(result)
  })
})

router.post('/del', function(req, res, next) {
  var params = req.body
  marketCenterDB.del(params.id).then(function(result) {
    console.log(result)
    res.json(result)
  })
})
router.get('/download', function(req, res, next) {
  var downloadPath = path.join(__dirname, '../db/db.json')
  var frs = fs.createReadStream(downloadPath)
  res.writeHead(200, {
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': 'attachment; filename=db.json'
  })
  frs.on('open', function() {
    frs.pipe(res)
  })
  // res.download(downloadPath, 'db.json', function(err) {
  //   if (err) {
  //     console.log(err)
  //     // 处理错误，请牢记可能只有部分内容被传输，所以
  //     // 检查一下res.headerSent
  //   } else {
  //     // 减少下载的积分值之类的
  //   }
  // })
})

module.exports = router
