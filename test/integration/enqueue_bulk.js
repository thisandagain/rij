var test    = require('tap').test,
    rij     = require('../../lib/index');

var limit   = 20;
var results = [];

test('integration', function (t) {
    for (var i = 0; i < limit; i++) {
        rij.enqueue({
            worker: __dirname + '/../fixtures/redis',
            job:    i
        }, function (err) {
            t.equal(err, null, 'error object should be null');
        });
    }

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
        t.type(msg.result, 'string', 'result should be of expected type');
        t.ok(msg.result >= 0 && msg.result < limit, 'result should equal expected');
        
        results.push(msg.result);
        if (results.length === limit) {
            t.end();
            setTimeout(process.exit, 500);
        }
    });

    rij.work();
});