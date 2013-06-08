var redis = require('redis');

module.exports = function (payload, callback) {
    var db = redis.createClient();
    var uid = 'rij::test::0';

    db.set(uid, payload, function (err) {
        if (err) return callback(err);
        db.get(uid, callback);
    });
};