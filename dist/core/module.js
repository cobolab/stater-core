'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Module = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _global = require('./global');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Module = exports.Module = function () {
    function Module(name, dependencies) {
        var _this = this;

        _classCallCheck(this, Module);

        _global.Log.assert(isString(name), 'Module name should be a String! => new Module(NAME, dependencies);');
        _global.Log.assert(isArray(dependencies), 'Module dependencies should be an Array! => new Module(name, DEPENDENCIES);');

        this.name = name;
        this.base = {};
        this.modules = [];

        dependencies.$each(function (name) {
            if (_this.modules.indexOf(name) < 0) _this.modules.push(name);
        });
    }

    _createClass(Module, [{
        key: 'require',
        value: function require(module_names) {
            var _this2 = this;

            if (isString(module_names)) {
                if (!this.modules.indexOf(module_names)) this.modules.push(module_names);
            } else if (isArray(module_names)) {
                module_names.$each(function (name) {
                    return _this2.require(name);
                });
            }
        }
    }]);

    return Module;
}();