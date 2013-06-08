var test    = require('tap').test,
    rij     = require('../../lib/index');

test('integration', function (t) {
    rij.enqueue({
        worker: __dirname + '/../fixtures/ok',
        job:    {
            foo: 'bar'
        }
    }, function (err) {
        t.equal(err, null, 'error object should be null');
    });

    rij.on('fatal', function (err) {
        t.equal(err, null, 'error object should be null');
        t.end();
        throw err;
    });

    rij.on('incomplete', function (task) {
        t.equal(task, null, 'task object should be null');
        t.end();
        throw task;
    });

    rij.on('complete', function (msg) {
        t.type(msg, 'object', 'message object should be an object');
        t.equal(msg.error, null, 'error object should be null');
        t.end();
        setTimeout(process.exit, 500);
    });

    rij.work();
});