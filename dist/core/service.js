'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Service = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _global = require('./global');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Service = exports.Service = function () {
    function Service(name) {
        var _this = this;

        _classCallCheck(this, Service);

        _global.Log.assert(isString(name), 'Service name should be a String! => new Service(NAME, dependencies);');

        this.name = name;
        this.services = [];

        // Creating service files and bases, and hide them.
        this.files = [];
        this.child = [];
        this.bases = {};

        ['files', 'bases', 'child'].$each(function (key) {
            Object.defineProperty(_this, key, {
                enumerable: false
            });
        });
    }

    _createClass(Service, [{
        key: 'addFile',
        value: function addFile(files) {
            var _this2 = this;

            if (isString(files)) {
                if (this.files.indexOf(files) < 0) {
                    this.files.push(files);
                }
            } else if (isArray(files)) {
                files.$each(function (file) {
                    _this2.addFile(file);
                });
            }

            return this;
        }
    }, {
        key: 'addChild',
        value: function addChild(childs) {
            var _this3 = this;

            if (isString(childs)) {
                if (this.child.indexOf(childs) < 0) {
                    this.child.push(childs);
                }
            } else if (isArray(childs)) {
                childs.$each(function (child) {
                    _this3.addChild(child);
                });
            }

            return this;
        }
    }, {
        key: 'require',
        value: function require(module_names) {
            var _this4 = this;

            if (isString(module_names)) {
                if (!this.services.indexOf(module_names)) this.services.push(module_names);
            } else if (isArray(module_names)) {
                module_names.$each(function (name) {
                    return _this4.require(name);
                });
            }
        }
    }]);

    return Service;
}();