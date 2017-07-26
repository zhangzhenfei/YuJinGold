import aesjs from 'aes-js'

/**
 * 获取地址参数
 *
 * @param {string} data N 链接
 * @returns JSON
 */
export const getUrlParameter = data => {
  let query = {}
  let url = data
    ? data.substr(data.indexOf('?'))
    : document.location.search.replace('?', '')
  let urlParams = []
  if (url) {
    urlParams = url.split('&')
    urlParams.forEach(item => {
      let value = item.split('=')
      query[value[0]] = value[1]
    })
  }
  return query
}

const key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
const iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]

/**
 * 文本加密
 * @param {string} text 需要加密的文本
 */
export const encrypt = text => {
  if (!text) return text
  const textBytes = aesjs.utils.utf8.toBytes(text)
  const aesCfb = new aesjs.ModeOfOperation.cfb(key, iv)
  const encryptedBytes = aesCfb.encrypt(textBytes)
  const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)
  return encryptedHex
}

/**
 * aesHex 解密
 * @param {string} encryptedHex 需要解密的Hex
 */
export const decrypt = encryptedHex => {
  if (!encryptedHex) return encryptedHex
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex)
  const aesCfb = new aesjs.ModeOfOperation.cfb(key, iv)
  const decryptedBytes = aesCfb.decrypt(encryptedBytes)
  const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)
  return decryptedText
}
