'use strict';

// Importing global modules.
import { Log, CLI, Loggy, Clihp } from './core/global';

// Load required modules.
var file = require('fs-extra'),
    path = require('path'),
    glob = require('glob');

// Get the CWD.
var cwd = process.cwd();

// Create new loggy instance.
import { Service } from './core/service';

class Stater {
    constructor () {
        // Create services list.
        this.services = {};

        // Create inilializer services list.
        this.inithooks = [];

        // Create providers list.
        this.providers = {};

        // Bootstrap core modules.
        this.bootstrap(path.join(__dirname, 'util'));

        // Publish the core providers and lock it.
        this.providers.Stater = this;

        Object.defineProperty(this.providers, 'Stater', { writable : false });
    }

    bootstrap ( services ) {
        Log.assert(isString(services) || isArray(services), 'Modules argument is required and should be a String folder name or Array contains folder names!');

        // Direct bootstrap
        if ( isString(services) ) {
            let root_dir, query;

            // Define root dir by getting the parent dir if the requested path is an absolute path.
            if ( services.match(/^\//) ) {
                root_dir = path.dirname(services);
            }

            // Define root dir by joining CWD and requested path if the the requested path is a relative path.
            else {
                // Create root dir from process.cwd.
                root_dir = process.cwd();

                // Create new request path by joining the root dir and requested path.
                services = path.join(root_dir, services);
            }

            // Creating glob query string by joining the requested path and js file pattern.
            query = path.join(services, '**/*.js');

            // Change the glob query string to single dir read if the requested path ends with ':'.
            if ( services.match(/\:$/) ) query = path.join(services, '*.js');

            // Find the service files, sort them, and register the service.
            glob.sync(query).$sorts(( a, b ) => a.length - b.length).$each(file => {
                let name, base, child;

                // Define service base path and file name.
                base = path.dirname(file);
                name = base.replace(root_dir, '').replace(/^\//, '').replace(/[\/]+/g, '.');

                // Get the service childrens.
                child = glob.sync(path.resolve(base, '*')).filter(function ( file ) {
                    return !path.extname(file);
                });

                // Register service and add the required files for the service.
                this.service(name).addFile(file).addChild(child);

                // Register as a startup service if the file base path is equal with the root service path.
                if ( base === services ) {
                    this.addInit(name);
                }
            });
        }
        else if ( isArray(services) ) {
            services.$each(service => {
                this.bootstrap(service);
            });
        }

        return this;
    }

    service ( name ) {
        // Try get the existing service.
        let svc = this.services[ name ];

        // Create new service if not exist.
        if ( !svc ) {
            // Create new service.
            svc = new Service(name);

            // Bind the Stater to the new service.
            svc.$core = this;

            // Register the new service to Stater.
            this.services[ name ] = svc;
        }

        // Return the service.
        return svc;
    }

    provider ( name, handler ) {
        if ( this.providers[ name ] ) {

        }
    }

    addInit ( name ) {
        Log.assert(isString(name), 'Startup service name should be a String!');
        Log.assert(isObject(this.services[ name ]), 'Startup service should be already registered!');

        if ( this.inithooks.indexOf(name) < 0 ) this.inithooks.push(name);

        return this;
    }

    create ( name, handler ) {
        Log.assert(isString(name), 'Service name is required and should be a String!');
        Log.assert(isFunction(handler), 'Service handler is required and should be a Function!');

        return this;
    }

    restart ( name ) {
        return this;
    }
}

module.exports = Stater;