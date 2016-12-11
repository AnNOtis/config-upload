#!/usr/bin/env node
'use strict'
const meow = require('meow')
const api = require('./api')

const cli = meow(`
  Usage
    $ config-upload

  Options
  -n, --no-fail-fast the process will not exit with failure until finish all tasks

  -c, --configs specify configuration file path. default is .uploadrc

  --variables variables for configuration

  Examples
    $ config-upload '{"revision": "v1.2.3"}'
`, {
  alias: {
    n: 'no-fail-fast',
    c: 'configs'
  }
})

api(cli)
