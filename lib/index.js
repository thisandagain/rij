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
    events      = require('events'),
    util        = require('util');

var enqueue     = require('./enqueue'),
    restore     = require('./restore'),
    worker      = require('./worker');

/**
 * Constructor
 */
function Rij () {
    var self = this;

    // Configuration
    self.setMaxListeners(0);
    self.cpus = require('os').cpus().length;
}

util.inherits(Rij, events.EventEmitter);

/**
 * Starts the worker queue.
 */
Rij.prototype.work = function () {
    var self = this;

    if (cluster.isWorker) worker();
    if (cluster.isMaster) {
        for (var i = 0; i < self.cpus; i++) {
            cluster.fork();
        }

        cluster.on('online', function (worker) {
            worker.on('message', function (msg) {
                msg = JSON.parse(msg);

                if (msg.error === null) return self.emit('complete', msg);
                restore(worker.process.pid, function (err) {
                    if (err) self.emit('fatal', err);
                    self.emit('incomplete', msg);
                });
            });
        });

        cluster.on('exit', function (worker, code) {
            if (code === 0) return cluster.fork();

            restore(worker.process.pid, function (err) {
                if (err) self.emit('fatal', err);
                cluster.fork();
            });
        });
    }
};

Rij.prototype.enqueue = function (task, callback) {
    if (cluster.isMaster) {
        // Validate
        if (typeof task.worker !== 'string') return callback('Worker path must be specified.');
        if (typeof task.job === 'undefined') return callback('Job must be specified.');
        
        // Defaults
        if (typeof task.retry === 'undefined') task.retry = 5;
        if (typeof task.timeout === 'undefined') task.timeout = 10000;
        if (typeof task.attempts === 'undefined') task.attempts = 0;

        // Enqueue task
        enqueue(task, callback);
    }
};

Rij.prototype.status = function (callback) {
    if (cluster.isMaster) {
        callback(null, {});
    }
};

/**
 * Export
 */
module.exports = new Rij();