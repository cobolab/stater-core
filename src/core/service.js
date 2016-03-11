'use strict';

import { Log, CLI } from './global';

export class Service {
    constructor ( name ) {
        Log.assert(isString(name), 'Service name should be a String! => new Service(NAME, dependencies);');

        this.name     = name;
        this.services = [];

        // Creating service files and bases, and hide them.
        this.files = [];
        this.child = [];
        this.bases = {};

        [ 'files', 'bases', 'child' ].$each(key => {
            Object.defineProperty(this, key, {
                enumerable : false
            });
        });
    }

    addFile ( files ) {
        if ( isString(files) ) {
            if ( this.files.indexOf(files) < 0 ) {
                this.files.push(files);
            }
        }
        else if ( isArray(files) ) {
            files.$each(file => {
                this.addFile(file);
            });
        }

        return this;
    }

    addChild ( childs ) {
        if ( isString(childs) ) {
            if ( this.child.indexOf(childs) < 0 ) {
                this.child.push(childs);
            }
        }
        else if ( isArray(childs) ) {
            childs.$each(child => {
                this.addChild(child);
            });
        }

        return this;
    }

    require ( module_names ) {
        if ( isString(module_names) ) {
            if ( !this.services.indexOf(module_names) ) this.services.push(module_names);
        }
        else if ( isArray(module_names) ) {
            module_names.$each(name => {
                return this.require(name);
            });
        }
    }
}