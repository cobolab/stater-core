'use strict';

import { Log, CLI } from './global';

export class Module {
    constructor ( name, dependencies ) {
        Log.assert(isString(name), 'Module name should be a String! => new Module(NAME, dependencies);');
        Log.assert(isArray(dependencies), 'Module dependencies should be an Array! => new Module(name, DEPENDENCIES);');

        this.name    = name;
        this.base    = {};
        this.modules = [];

        dependencies.$each(name => {
            if ( this.modules.indexOf(name) < 0 ) this.modules.push(name);
        });
    }

    require ( module_names ) {
        if ( isString(module_names) ) {
            if ( !this.modules.indexOf(module_names) ) this.modules.push(module_names);
        }
        else if ( isArray(module_names) ) {
            module_names.$each(name => {
                return this.require(name);
            });
        }
    }
}