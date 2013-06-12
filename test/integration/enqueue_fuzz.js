var test    = require('tap').test,
    rij     = require('../../index')();

var limit   = 10;
var results = [];

test('integration', function (t) {
    for (var i = 0; i < limit; i++) {
        rij.enqueue({
            worker: __dirname + '/../fixtures/fuzz.js',
            job:    i,
            retry:  100
        }, function (err) {
            t.equal(err, null, 'error object should be null');
        });
    }

    var queue = rij.queue();

    queue.on('fatal', function (err) {
        t.equal(err, null, 'error object should be null');
        t.end();
        throw err;
    });

    queue.on('incomplete', function (msg) {
        t.type(msg, 'object', 'message object should be an object');
        t.equal(msg.error, 'Fail', 'error object should be as expected');
    });

    queue.on('complete', function (msg) {
        t.type(msg, 'object', 'message object should be an object');
        t.equal(msg.error, null, 'error object should be null');
        t.type(msg.result, 'string', 'result should be of expected type');
        t.equal(msg.result, 'Ok', 'result should equal expected');
        
        results.push(msg.result);
        if (results.length === limit) {
            t.end();
            setTimeout(process.exit, 500);
        }
    });
});