'use strict';

export var imports = [ 'file' ];

export function CLIProvider () {
    return new Clihp.Parser();
}

CLIProvider.$provide = [ 'File' ];