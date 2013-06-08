/**
 * Restores a pending job to the queue.
 *
 * @package rij
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var enqueue = require('./enqueue'),
    hash    = require('./hash'),
    redis   = require('./redis');

/**
 * Export
 */
module.exports = function (pid, callback) {
    var db      = redis();
    var list    = 'rij::queue';

    // Get pending item
    db.get(hash(pid), function (err, obj) {
        if (err) return callback(err);

        try {
            // Parse task
            obj = JSON.parse(obj);

            // Evaluate attempts / retry status
            if (obj.attempts >= obj.retry) return callback('Retry limit reached.');
            obj.attempts++;

            // Enqueue task
            enqueue(obj, callback);
        } catch (err) {
            callback(err);
        }
    });
};