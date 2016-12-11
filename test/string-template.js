import test from 'ava'
import st from '../string-template'

test('normal case', t => {
  t.is(st('[foo][bar]', {foo: 'FOO', bar: 'BAR'}), 'FOOBAR')
  t.is(st('[foo]-[bar]', {foo: 'FOO', bar: 'BAR'}), 'FOO-BAR')
})

test('template is not a string', t => {
  t.is(st(123), '')
  t.is(st(null), '')
  t.is(st(undefined), '')
  t.is(st(true), '')
  t.is(st({}), '')
})

test('with uncompleted bracket', t => {
  const error = t.throws(() => st('foo[bar'), Error)
  t.is(error.message, 'Uncompleted bracket.')
})

test('start with close bracket', t => {
  const error = t.throws(() => st('foo]'), Error)
  t.is(error.message, 'Start with close bracket.')
})

test('context is not an object', t => {
  t.is(st('[foo]bar', 'string'), 'bar')
  t.is(st('[foo]bar', 123), 'bar')
})
