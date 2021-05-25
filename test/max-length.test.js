/*
 * Copyright 2020 Trent Mick
 *
 * Test the `log.trace(...)`, `log.debug(...)`, ..., `log.fatal(...)` API.
 */

var util = require('util'),
    format = util.format,
    inspect = util.inspect;
var test = require('tap').test;

var bunyan = require('../lib/bunyan');

// ---- test maxLength truncation

// Piggyback off test config in log.test.js
//
function Catcher() {
    this.records = [];
}
Catcher.prototype.write = function (record) {
    this.records.push(record);
}
var catcher = new Catcher();

var log3 = new bunyan.createLogger({
    name: 'log3',
    maxLength: 10,
    streams: [
        {
            type: 'raw',
            stream: catcher,
            level: 'trace'
        }
    ]
});

var names = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];

test('basic truncation test', function (t) {
    names.forEach(function (lvl) {
        log3[lvl].call(log3, 'some message');
        var rec = catcher.records[catcher.records.length - 1];
        t.equal(rec.msg, 'some messa...', format('log.%s msg: got %j', lvl, rec.msg));
    });
    t.end();
});

test('json truncation test', function (t) {
    names.forEach(function (lvl) {
        log3[lvl].call(log3, {"foo":"bar","number":42}, 'some message');
        var rec = catcher.records[catcher.records.length - 1];
        t.equal(rec.msg, 'some messa...', format('log.%s msg: got %j', lvl, rec.msg));
    });
    t.end();
});

test('json with message truncation test', function (t) {
    names.forEach(function (lvl) {
        log3[lvl].call(log3, 'obj', {"foo":"bar","number":42});
        var rec = catcher.records[catcher.records.length - 1];
        t.equal(rec.msg, 'obj { foo:...', format('log.%s msg: got %j', lvl, rec.msg));
    });
    t.end();
});

