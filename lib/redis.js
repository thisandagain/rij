/**
 * Redis connection adapter.
 *
 * @package rij
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var redis = require('redis');

/**
 * Export
 */
module.exports = function () {
    return redis.createClient();
};