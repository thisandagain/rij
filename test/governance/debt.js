var test    = require('tap').test,
    bux     = require('codebux');

var debt    = bux(__dirname + '/../../index.js');
debt.on('error', function (err) {});
debt.on('end', function (total) {
    console.log(total);

    test('governance', function (t) {
        t.type(total, 'number', 'result should be a number');
        t.ok(total > 50, 'result should be greater than 50');
        t.end();
    });
});
