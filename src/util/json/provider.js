'use strict';

export function JSONProvider ( file ) {
    return { read, write };

    function read ( src ) {
        return file.readJsonSync(src);
    }

    function write ( dest, content ) {
        return file.writeJsonSync(dest, content);
    }
}

JSONProvider.$provide = [ 'File' ];
