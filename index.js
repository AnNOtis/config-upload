const path = require('path')
const loadJsonFile = require('load-json-file')
const glob = require('glob')
const isEmpty = require('lodash/isEmpty')
const S3Uploader = require('./uploaders/s3')
const stringTemplate = require('./string-template')

const DEFAULT_CONFIG_PATH = '.uploadrc'

function api(cli) {
  let failFast = true
  if (cli.flags.noFailFast) {
    failFast = false
  }

  const configs = loadJsonFile.sync(cli.flags.configs || DEFAULT_CONFIG_PATH)
  if (!configs.sources || configs.sources.length === 0) {
    throw new Error('Should contains sources configuration')
  }

  const context = Object.assign({}, JSON.parse(cli.flags.context), configs.context)

  try {
    configs.sources.forEach(function (source) {
      _uploadSource(source, configs, context)
    })
  } catch (err) {
    if (failFast) {
      throw err
    } else {
      console.log(err)
    }
  }
}

function _uploadSource(source, configs, context) {
  if (!source.include) {
    throw new Error('"include" should not be empty.')
  }

  if (!source.dist) {
    throw new Error('"include" should not be empty.')
  }

  const distConfig = configs.dists[source.dist]
  if (!distConfig || isEmpty(distConfig)) {
    throw new Error(`Distination "${source.dist}" is not found or empty.`)
  }

  const includeFiles = glob.sync(source.include, {nodir: true, ignore: source.exclude})
  const uploader = _uploader(distConfig.type || source.dist, distConfig)

  includeFiles.forEach(function (file) {
    const parsedPath = path.parse(file)
    const fileContext = Object.assign({}, context, {ext: parsedPath.ext.slice(1), name: parsedPath.name})

    const folder = stringTemplate(source.folder || distConfig.folder, fileContext)
    const filename = stringTemplate(
      source.filename || configs.filename || '[name].[ext]',
      fileContext
    )

    uploader.upload(file, folder, filename)
  })
}

function _uploader(type, options) {
  switch (type) {
    case 's3':
      return new S3Uploader(options)
    default:
      throw new Error(`No correspond uploader "${type}"`)
  }
}

module.exports = api
