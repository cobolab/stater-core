'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CLIProvider = CLIProvider;
var imports = exports.imports = ['file'];

function CLIProvider() {
    return new Clihp.Parser();
}

CLIProvider.$provide = ['File'];