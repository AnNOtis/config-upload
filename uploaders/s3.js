const fs = require('fs')
const path = require('path')
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

S3Uploader.prototype.upload = function (source, folder) {
  const uploadParams = { Key: '', Body: '' }
  const fileStream = fs.createReadStream(source);
  fileStream.on('error', function(err) {
    console.log('File Error', err);
  });
  uploadParams.Body = fileStream;
  uploadParams.Key = (folder || this.options.folder || '') + '/' + path.basename(source);

  this.uploader.upload (uploadParams, function (err, data) {
    if (err) {
      console.log(err);
      throw new Error("Error", err);
    } if (data) {
      console.log("Upload Success", data.Location);
    }
  })
}

module.exports = S3Uploader
