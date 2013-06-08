module.exports = function (payload, callback) {
    var fail = Boolean(Math.round(Math.random()));
    if (fail) return callback('Fail');
    callback(null, 'Ok');
};