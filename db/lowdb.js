const path = require('path')
const low = require('lowdb')
const LodashId = require('lodash-id')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync(path.join(__dirname, './db.json')) // 保存路径为db/db.json
const db = low(adapter)
db._.mixin(LodashId)

// Set some defaults (required if your JSON file is empty)
db.defaults({ markets: [] }).write()

function saveOrUpdate(model) {
  // 先去数据库种查找，如果查找到则更新，否则插入
  return new Promise(function(resolve, reject) {
    const instance = db.get('markets')
    const dbModel = instance.getById(model.id).value()
    if (dbModel) {
      instance.updateById(model.id).write()
    } else {
      instance.insert(model).write()
    }
    resolve({ result: { ok: 1 } })
  })
}

/**
 * 查找市场行情设置
 * @returns Promise
 */
function find() {
  return new Promise(function(resolve, reject) {
    const value = db.get('markets').value()
    console.log('查询结果为：', value)
    resolve(value)
  })
}

/**
 * 删除市场行情设置
 * @param {any} id id
 * @returns Promise
 */
function del(id) {
  return new Promise(function(resolve, reject) {
    const instance = db.get('markets')
    instance.removeById(id).write()
    resolve({ result: { ok: 1 } })
  })
}

module.exports = {
  saveOrUpdate,
  find,
  del
}
