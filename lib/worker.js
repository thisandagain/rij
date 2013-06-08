/**
 * Indepotent worker module.
 *
 * @package rij
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var dequeue = require('./dequeue');

/**
 * Delayed process exit
 */
function exit () {
    setTimeout(process.exit, 2000);
}

/**
 * Export
 */
module.exports = function () {
    var self = this;

    dequeue(function (err, obj) {
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