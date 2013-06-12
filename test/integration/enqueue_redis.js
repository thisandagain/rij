var test    = require('tap').test,
    rij     = require('../../index')();

test('integration', function (t) {
    rij.enqueue({
        worker: __dirname + '/../fixtures/redis.js',
        job:    'hello from rij'
    }, function (err) {
        t.equal(err, null, 'error object should be null');
    });

    var queue = rij.queue();

    queue.on('fatal', function (err) {
        t.equal(err, null, 'error object should be null');
        t.end();
        throw err;
    });

    queue.on('incomplete', function (task) {
        t.equal(task, null, 'task object should be null');
        t.end();
        throw task;
    });

    queue.on('complete', function (msg) {
        t.type(msg, 'object', 'message object should be an object');
        t.equal(msg.error, null, 'error object should be null');
        t.equal(msg.result, 'hello from rij', 'result should equal expected');
        t.end();
        setTimeout(process.exit, 500);
    });
});