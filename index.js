const loadJsonFile = require('load-json-file')
const paths = require('path')
const glob = require('glob')
const isEmpty = require('lodash/isEmpty')

const DEFAULT_CONFIG_PATH =  '.uploadrc'

function api (cli) {
  const configs = loadJsonFile.sync(cli.flags.configs || DEFAULT_CONFIG_PATH)

  if (!configs.sources || configs.sources.length === 0) {
    throw new Error('Should contains sources configuration')
  }

  configs.sources.forEach(function (source) {
    _uploadSource(source, configs)
  })
}

function _uploadSource(source, configs) {
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

  const includeFiles = glob.sync(source.include, { nodir: true, ignore: source.exclude })
  const uploader = _uploader(distConfig.type || source.dist, distConfig)

  includeFiles.forEach(function(file) {
    uploader.upload(file, source.folder)
  })
}

function _uploader(type, options) {
  switch (type) {
    case 's3':
      const Uploader = require('./uploaders/s3')
      return new Uploader(options)
    default:
      throw new Error(`No correspond uploader "${type}"`)
  }
}

module.exports = api
