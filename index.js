/**
 * A safe and sensible work queue.
 *
 * @package rij
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var cluster     = require('cluster'),
    defaults    = require('defaults'),
    fs          = require('fs');

var Cluster     = require('./lib/cluster'),
    Redis       = require('./lib/redis');

/**
 * Export
 */
module.exports = function (config) {
    // Default configuration
    config = defaults(config, {
        namespace:      'rij',
        retry:          5,
        timeout:        10000,
        concurrency:    require('os').cpus().length,

        host:           null,
        port:           null,
        password:       null
    });

    // Return methods
    return {
        enqueue:    function (task, callback) {
            if (cluster.isWorker) return;
            
            // Defaults
            task = defaults(task, {
                retry:      config.retry,
                timeout:    config.timeout
            });

            // Validate
            if (!fs.existsSync(task.worker)) return callback('Worker path must be valid.');
            if (typeof task.job === 'undefined') return callback('Job must be specified.');

            // Enqueue
            var redis = new Redis(config);
            redis.enqueue(task, callback);
        },
        queue:      function () {
            return new Cluster(config);
        }
    };
};