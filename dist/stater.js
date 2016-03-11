'use strict';

// Importing global modules.

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _global = require('./core/global');

var _service = require('./core/service');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Load required modules.
var file = require('fs-extra'),
    path = require('path'),
    glob = require('glob');

// Get the CWD.
var cwd = process.cwd();

// Create new loggy instance.

var Stater = function () {
    function Stater() {
        _classCallCheck(this, Stater);

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

        Object.defineProperty(this.providers, 'Stater', { writable: false });
    }

    _createClass(Stater, [{
        key: 'bootstrap',
        value: function bootstrap(services) {
            var _this = this;

            _global.Log.assert(isString(services) || isArray(services), 'Modules argument is required and should be a String folder name or Array contains folder names!');

            // Direct bootstrap
            if (isString(services)) {
                (function () {
                    var root_dir = undefined,
                        query = undefined;

                    // Define root dir by getting the parent dir if the requested path is an absolute path.
                    if (services.match(/^\//)) {
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
                    if (services.match(/\:$/)) query = path.join(services, '*.js');

                    // Find the service files, sort them, and register the service.
                    glob.sync(query).$sorts(function (a, b) {
                        return a.length - b.length;
                    }).$each(function (file) {
                        var name = undefined,
                            base = undefined,
                            child = undefined;

                        // Define service base path and file name.
                        base = path.dirname(file);
                        name = base.replace(root_dir, '').replace(/^\//, '').replace(/[\/]+/g, '.');

                        // Get the service childrens.
                        child = glob.sync(path.resolve(base, '*')).filter(function (file) {
                            return !path.extname(file);
                        });

                        // Register service and add the required files for the service.
                        _this.service(name).addFile(file).addChild(child);

                        // Register as a startup service if the file base path is equal with the root service path.
                        if (base === services) {
                            _this.addInit(name);
                        }
                    });
                })();
            } else if (isArray(services)) {
                services.$each(function (service) {
                    _this.bootstrap(service);
                });
            }

            return this;
        }
    }, {
        key: 'service',
        value: function service(name) {
            // Try get the existing service.
            var svc = this.services[name];

            // Create new service if not exist.
            if (!svc) {
                // Create new service.
                svc = new _service.Service(name);

                // Bind the Stater to the new service.
                svc.$core = this;

                // Register the new service to Stater.
                this.services[name] = svc;
            }

            // Return the service.
            return svc;
        }
    }, {
        key: 'provider',
        value: function provider(name, handler) {
            if (this.providers[name]) {}
        }
    }, {
        key: 'addInit',
        value: function addInit(name) {
            _global.Log.assert(isString(name), 'Startup service name should be a String!');
            _global.Log.assert(isObject(this.services[name]), 'Startup service should be already registered!');

            if (this.inithooks.indexOf(name) < 0) this.inithooks.push(name);

            return this;
        }
    }, {
        key: 'create',
        value: function create(name, handler) {
            _global.Log.assert(isString(name), 'Service name is required and should be a String!');
            _global.Log.assert(isFunction(handler), 'Service handler is required and should be a Function!');

            return this;
        }
    }, {
        key: 'restart',
        value: function restart(name) {
            return this;
        }
    }]);

    return Stater;
}();

module.exports = Stater;