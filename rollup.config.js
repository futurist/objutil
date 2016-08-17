// rollup.config.js

export default {
  entry: './src/objutil.js',
  moduleName: 'objutil',
  moduleId: 'objutil',
  targets: [
    { format: 'iife', dest: 'dist/objutil.iife.js' },
    { format: 'amd',  dest: 'dist/objutil.amd.js'  },
    { format: 'cjs',  dest: 'dist/objutil.cjs.js'  },
    { format: 'es',   dest: 'dist/objutil.es.js'   }
  ]
}
