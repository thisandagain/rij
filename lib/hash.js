/**
 * Creates an MD5 hash key for a task.
 *
 * @package rij
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var crypto  = require('crypto'),
    os      = require('os');

/**
 * Export
 */
module.exports = function (pid) {
    var prefix  = 'rij::pending::';
    var md5     = crypto.createHash('md5');
    md5.update(pid.toString() + JSON.stringify(os.networkInterfaces()));

    return prefix + md5.digest('hex');
};