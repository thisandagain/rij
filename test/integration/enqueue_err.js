var test    = require('tap').test,
    rij     = require('../../index')();

rij.enqueue({
    worker: __dirname + '/../fixtures/err.js',
    job:    {
        foo: 'bar'
    }
}, function (err) {
    if (err) throw err;
});

test('integration', function (t) {
    var queue = rij.queue();

    queue.on('fatal', function (err) {
        t.type(err, 'string', 'error object should be a string');
        t.end();
        setTimeout(process.exit, 500);
    });

    queue.on('incomplete', function (msg) {
        t.type(msg, 'object', 'message should be an object');
        t.type(msg.task, 'object', 'task should be an object');
        t.ok(typeof msg.error !== 'undefined', 'error should not be undefined');
    });

    queue.on('complete', function (msg) {
        t.equal(msg, null, 'message object should be null');
        throw msg;
    });
});