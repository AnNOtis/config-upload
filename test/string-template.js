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
  let error
  error = t.throws(() => st('[foo]bar', 'string'), Error)
  t.is(error.message, 'The context "foo" is not defined.')
  error = t.throws(() => st('[foo]bar', 123), Error)
  t.is(error.message, 'The context "foo" is not defined.')
})

test('specific context is not defined', t => {
  let error
  error = t.throws(() => st('foo[bar]', {foo: 'foo'}), Error)
  t.is(error.message, 'The context "bar" is not defined.')
})
