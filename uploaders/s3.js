const fs = require('fs')
const AWS = require('aws-sdk')

const S3Uploader = function (options) {
  if (!options.bucket) {
    throw new Error('s3\'s bucket should not be empty')
  }

  this.uploader = new AWS.S3({
    params: {
      Bucket: options.bucket
    }
  })

  this.options = options
}

S3Uploader.prototype.upload = function (sourcePath, folder, filename) {
  const fileStream = fs.createReadStream(sourcePath)
  fileStream.on('error', function (err) {
    throw err
  })

  const uploadParams = {
    Key: folder + '/' + filename,
    Body: fileStream
  }

  this.uploader.upload(uploadParams, function (err, data) {
    if (err) {
      throw err
    } else if (data) {
      console.log('Upload Success', data.Location)
    }
  })
}

module.exports = S3Uploader
