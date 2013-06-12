/**
 * Redis connection adapter.
 *
 * @package rij
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var crypto  = require('crypto'),
    os      = require('os'),
    redis   = require('redis');

/**
 * Constructor
 */
function Redis (config) {
    var self = this;

    // Helpers
    self.config = config;
    
    self.client = function () {
        var client = redis.createClient(self.config.port, self.config.host);
        if (self.config.password !== null) client.auth(self.config.password);

        return client;
    };

    self.hash   = function (pid) {
        var prefix  = 'rij::pending::';
        var md5     = crypto.createHash('md5');
        md5.update(pid.toString() + JSON.stringify(os.networkInterfaces()));

        return prefix + md5.digest('hex');
    };
}

/**
 * Enqueues a new task.
 *
 * @param {Object} Task
 *
 * @return {Object}
 */
Redis.prototype.enqueue = function (task, callback) {
    var self = this;

    var db      = self.client();
    var list    = self.config.namespace + '::queue';
    var obj     = '';

    try {
        obj = JSON.stringify(task);
    } catch (err) {
        return callback(err);
    }

    db.rpush(list, obj, callback);
};

/**
 * Dequeues the oldest task.
 *
 * @param {Object} Task
 *
 * @return {Object}
 */
Redis.prototype.dequeue = function (callback) {
    var self = this;

    var db      = self.client();
    var list    = self.config.namespace + '::queue';

    db.lpop(list, function (err, obj) {
        if (err) return callback(err);
        if (typeof obj === 'undefined') return callback(null, null);
        if (obj === null) return callback(null, null);

        db.set(self.hash(process.pid), obj, function (err) {
            if (err) return callback(err);

            try {
                obj = JSON.parse(obj);
            } catch (e) {
                return callback(e);
            }

            callback(null, obj);
        });
    });
};

/**
 * Enqueues a new task.
 *
 * @param {Object} Task
 *
 * @return {Object}
 */
Redis.prototype.restore = function (pid, callback) {
    var self = this;

    var db      = self.client();
    var list    = self.config.namespace + '::queue';

    // Get pending item
    db.get(self.hash(pid), function (err, obj) {
        if (err) return callback(err);

        try {
            // Parse task
            obj = JSON.parse(obj);

            // Evaluate attempts / retry status
            if (obj.attempts >= obj.retry) return callback('Retry limit reached.');
            obj.attempts++;

            // Enqueue task
            self.enqueue(obj, callback);
        } catch (e) {
            callback(e);
        }
    });
};

/**
 * Export
 */
module.exports = Redis;