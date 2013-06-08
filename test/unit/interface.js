var test    = require('tap').test,
    rij     = require('../../lib/index');

test('unit', function (t) {
    t.type(rij, 'object', 'module is an object');
    t.type(rij.enqueue, 'function', 'function exists');
    t.type(rij.status, 'function', 'function exists');
    t.type(rij.work, 'function', 'function exists');
    t.end();
});