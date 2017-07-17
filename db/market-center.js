var co = require('co')
var MongoClient = require('mongodb').MongoClient
var connect = MongoClient.connect(
  'mongodb://f9bd54217cc4450ea727e0efe2cb9643:af7b47e007944ef293636cac3d08b241@mongo.duapp.com:8908/AMmvmWrttRjLLKdkstKR?authMechanism=DEFAULT&authSource=AMmvmWrttRjLLKdkstKR'
)
var db // 每次来请求时复用已有连接执行query，如果连接已被server端断开底层驱动会自动重连
var onerror = function (e) {
  console.error(e)
  // db.close()
}
// 启动时建立连接
co(function* () {
  db = yield connect
}).catch(onerror)

/**
 * 新增市场行情设置
 * @param {Object} model 市场模型数据
 * @returns Promise
 */
function saveOrUpdate(model) {
  var gen = function* () {
    var col = db.collection('market_center')
    var result = yield col.updateOne({ id: model.id }, model, { upsert: true })
    return result
  }
  return co(gen).catch(onerror)
}

/**
 * 查找市场行情设置
 * @param {any} query 查询对象
 * @returns Promise
 */
function find(query) {
  var gen = function* () {
    var col = db.collection('market_center')
    var docs = yield col.find(query).sort([['order', 1]]).toArray()
    return docs
  }
  return co(gen).catch(onerror)
}

/**
 * 删除市场行情设置
 * @param {any} id id
 * @returns Promise
 */
function del(id) {
  var gen = function* () {
    var col = db.collection('market_center')
    var result = yield col.deleteOne({ id: id })
    return result
  }
  return co(gen).catch(onerror)
}

module.exports = {
  saveOrUpdate,
  find,
  del
}
