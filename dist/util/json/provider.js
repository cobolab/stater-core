'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.JSONProvider = JSONProvider;
function JSONProvider(file) {
    return { read: read, write: write };

    function read(src) {
        return file.readJsonSync(src);
    }

    function write(dest, content) {
        return file.writeJsonSync(dest, content);
    }
}

JSONProvider.$provide = ['File'];