const qiniu = require('qiniu')

const QiniuUploader = function (options) {
  if (!options.bucket) {
    throw new Error('Qiniu\'s bucket should not be empty')
  }

  if (!options.accessKey) {
    throw new Error('Need a "accessKey" for qiniu upload')
  }

  if (!options.secretKey) {
    throw new Error('Need a "secretKey" for qiniu upload')
  }

  qiniu.conf.ACCESS_KEY = options.accessKey
  qiniu.conf.SECRET_KEY = options.secretKey

  this.bucket = options.bucket
  this.options = options
}

QiniuUploader.prototype.upload = function (sourcePath, folder, filename) {
  const putPolicy = new qiniu.rs.PutPolicy(this.bucket + ':' + filename)
  const token = putPolicy.token()
  const extra = new qiniu.io.PutExtra()
  qiniu.io.putFile(token, filename, sourcePath, extra, function (err, data) {
    if (err) {
      throw err
    } else {
      console.log('Upload Success', data.hash, data.key)
    }
  })
}

module.exports = QiniuUploader
