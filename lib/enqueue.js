/**
 * Enqueues a new task.
 *
 * @package rij
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var redis = require('./redis');

/**
 * Export
 */
module.exports = function (task, callback) {
    var db      = redis();
    var list    = 'rij::queue';
    var obj     = '';

    try {
        obj = JSON.stringify(task);
    } catch (err) {
        return callback(err);
    }

    db.rpush(list, obj, callback);
};