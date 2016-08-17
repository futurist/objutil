// rollup.config.js

import path from 'path'
import fs from 'fs'

var argv = process.argv

// pass args from rollup:
// rollup -c --objutil extend,pick
var vars = 'is, own, isIterable, isPrimitive, deepIt, get, extend, exclude, pick, pick2, defaults'
var pos = argv.indexOf('--obj')
if(pos>0 && argv[pos+1]) vars = argv[pos+1]

var entry = path.join(__dirname, './src/objutil.js')
var exportStr = '\nexport { '+ vars +' }'

// console.log(exportStr)

export default {
  entry: entry,
  plugins: [
    memory({
      contents: fs.readFileSync(entry) + exportStr
    })
  ],
  moduleName: 'objutil',
  moduleId: 'objutil',
  targets: [
    { format: 'iife', dest: path.join(__dirname, 'dist/objutil.iife.js') },
    { format: 'amd',  dest: path.join(__dirname, 'dist/objutil.amd.js')  },
    { format: 'cjs',  dest: path.join(__dirname, 'dist/objutil.cjs.js')  },
    { format: 'es',   dest: path.join(__dirname, 'dist/objutil.es.js')   }
  ]
}



// code from plugin rollup-plugin-memory
function once(fn) {
    var called = false;
    return function () {
        if (!called) {
            called = true;
            return fn.apply(undefined, arguments);
        }
    };
}

function memory() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    if (typeof opts.contents !== 'string' && !(opts.contents instanceof Buffer)) {
        throw Error(['rollup-plugin-memory', 'opts.contents should be string or buffer instance'].join(': '));
    }

    var contents = opts.contents.toString();
    var path = typeof opts.path === 'string' ? opts.path : false;

    return {
        resolveId: once(function (id) {
            return path || id;
        }),
        load: once(function () {
            return contents;
        })
    };
}
