import test from 'ava'
import packageObject from '../package'

test('name', t => {
  t.is(packageObject.name, 'config-upload')
})
