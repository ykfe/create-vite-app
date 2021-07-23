import path from 'path';
import rollupBaseConfig from '../../rollup.config';
import pkg from './package.json';

const external = [
  'fsevents',
  'anymatch',
  'is-binary-path',
  'object-assign',
  ...Object.keys(pkg.peerDependencies),
];

export default Object.assign(rollupBaseConfig, {
  input: {
    index: './src/index.ts',
    cli: './src/cli.ts',
  },
  output: [
    {
      dir: path.resolve(__dirname, 'dist/cjs'),
      entryFileNames: `[name].js`,
      chunkFileNames: 'chunks/dep-[hash].js',
      exports: 'named',
      format: 'cjs',
      sourcemap: true,
    },
    {
      dir: path.resolve(__dirname, 'dist/esm'),
      entryFileNames: `[name].js`,
      chunkFileNames: 'chunks/dep-[hash].js',
      format: 'es',
      sourcemap: true,
    },
  ],
  external,
  onwarn(warning, warn) {
    // vite use the eval('require') trick to deal with optional deps
    if (warning.message.includes('Use of eval')) {
      return;
    }
    if (warning.message.includes('Circular dependency')) {
      return;
    }
    warn(warning);
  },
});
