var express = require('express')
var router = express.Router()
var axios = require('axios')
var marketCenterDB = require('../db/market-center')

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

module.exports = router
