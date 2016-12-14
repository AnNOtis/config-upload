#!/usr/bin/env node
'use strict'
const meow = require('meow')
const init = require('../index')

const cli = meow(`
  Usage
    $ config-upload [options]

  Options
    --init           Initialize a configuration file.
    --no-fail-fast   Upload all files no matter what. Default will exiting on first failure.
    --config         Config file path. Default is ".config-upload.json".
    --context        Additional context provided to config.

  Examples
    $ config-upload
    $ config-upload --config path/to/config.json
    $ config-upload --context '{"revision": "v1.2.3"}'

  Config
    see: https://github.com/AnNOtis/config-upload
`
)

init(cli)
