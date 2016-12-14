const fs = require('fs')
const AWS = require('aws-sdk')

const S3Uploader = function (options) {
  if (!options.bucket) {
    throw new Error('s3\'s bucket should not be empty')
  }

  let authParams
  if (options.accessKey && options.secretKey) {
    authParams = {
      accessKeyId: options.accessKey,
      secretAccessKey: options.secretKey
    }
  } else if (options.credentials) {
    authParams = {
      credentials: options.credentials
    }
  } else if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error(
      'Need credentials.' +
      'You can choose to provide "accessKey" and "secretKey" ' +
      'or provide "credentials" file.'
    )
  }

  this.uploader = new AWS.S3(Object.assign(
    {
      params: {
        Bucket: options.bucket
      }
    },
    authParams
  ))

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
