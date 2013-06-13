var test    = require('tap').test,
    rij     = require('../../index')();

test('integration', function (t) {
    rij.enqueue({
        worker: __dirname + '/../fixtures/ok.js',
        job:    {
            foo: 'bar'
        }
    }, function (err) {
        console.dir(err);
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
        console.dir(msg.error);
        t.equal(msg.error, null, 'error object should be null');
        t.end();
        setTimeout(process.exit, 500);
    });
});