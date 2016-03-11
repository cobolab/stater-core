'use strict';

// Load global dependencies if not loaded.

if (!global.JSFix) require('cb-jsfix');
if (!global.Loggy) require('cb-loggy');
if (!global.Clihp) require('cb-clihp');

var Log = new Loggy(),
    CLI = new Clihp.Parser();

module.exports = { Log: Log, CLI: CLI, Loggy: Loggy, Clihp: Clihp };