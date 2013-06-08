/**
 * Dequeues a task.
 *
 * @package rij
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var hash    = require('./hash'),
    redis   = require('./redis');

/**
 * Export
 */
module.exports = function (callback) {
    var db      = redis();
    var list    = 'rij::queue';

    db.lpop(list, function (err, obj) {
        if (err) return callback(err);
        if (typeof obj === 'undefined') return callback(null, null);
        if (obj === null) return callback(null, null);

        db.set(hash(process.pid), obj, function (err) {
            if (err) return callback(err);

            try {
                obj = JSON.parse(obj);
            } catch (err) {
                return callback(err);
            }

            callback(null, obj);
        });
    });
};