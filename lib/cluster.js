/**
 * Cluster-based worker queue.
 *
 * @package rij
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var cluster     = require('cluster'),
    events      = require('events'),
    util        = require('util');

var Redis       = require('./redis');

/**
 * Constructor
 */
function Cluster (config) {
    var self = this;

    // Event Emitter
    self.setMaxListeners(0);

    // Helpers
    var exit = function () {
        setTimeout(process.exit, 2000);
    };

    var work = function () {
        var redis = new Redis(config);
        redis.dequeue(function (err, obj) {
            if (err) throw err;
            if (typeof obj === 'undefined' || obj === null) return exit();

            require(obj.worker)(obj.job, function (err, result) {
                process.send(JSON.stringify({
                    task:   obj,
                    error:  err,
                    result: result
                }));
                process.exit();
            });
        });
    };

    // Cluster
    if (cluster.isWorker) work();
    if (cluster.isMaster) {
        // Create redis client
        var redis = new Redis(config);

        // Spawn workers
        for (var i = 0; i < config.concurrency; i++) {
            cluster.fork();
        }

        // Process 'online' handler
        cluster.on('online', function (worker) {
            worker.on('message', function (msg) {
                msg = JSON.parse(msg);

                if (msg.error === null) return self.emit('complete', msg);
                redis.restore(worker.process.pid, function (err) {
                    if (err) self.emit('fatal', err);
                    self.emit('incomplete', msg);
                });
            });
        });

        // Process 'exit' handler
        cluster.on('exit', function (worker, code) {
            if (code === 0) return cluster.fork();

            redis.restore(worker.process.pid, function (err) {
                if (err) self.emit('fatal', err);
                cluster.fork();
            });
        });
    }
}

/**
 * Inherit event emitter
 */
util.inherits(Cluster, events.EventEmitter);

/**
 * Export
 */
module.exports = Cluster;