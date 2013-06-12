var test    = require('tap').test,
    rij     = require('../../index')();

test('unit', function (t) {
    t.type(rij, 'object', 'module is an object');
    t.type(rij.enqueue, 'function', 'function exists');
    t.type(rij.queue, 'function', 'function exists');
    t.end();
});