#!/usr/bin/env node
'use strict'
const meow = require('meow')
const init = require('../index')

const cli = meow(`
  Usage
    $ config-upload

  Options
  -n, --no-fail-fast the process will not exit with failure until finish all tasks

  -c, --configs specify configuration file path. default is .uploadrc

  -x, --context context for configuration

  Examples
    $ config-upload

    $ config-upload --context '{"revision": "v1.2.3"}'
`, {
  alias: {
    n: 'no-fail-fast',
    c: 'configs',
    x: 'context'
  }
})

init(cli)
