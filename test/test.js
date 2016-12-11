import test from 'ava';
import packageObject from '../package.json'

test('name', t => {
	t.is(packageObject.name, 'config-upload');
});
