import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { babel } from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import typescript from '@rollup/plugin-typescript';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import commonjs from '@rollup/plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import sourcemaps from 'rollup-plugin-sourcemaps';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const extensions = ['.ts', '.tsx'];

const serveFiles = process.env.ROLLUP_SERVE === 1;

const servePlugins = [
  serve({
    open: true,
    verbose: true,
    openPage: '/index_full.html',
    contentBase: '',
    host: '0.0.0.0',
    // host: 'localhost',
    port: 5678,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  }),
  livereload('dist'),
];

console.log('serveFiles', serveFiles);

const indexConfig = {
  plugins: [
    resolve({ extensions, browser: true }),
    commonjs(),
    uglify(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: ['solid', '@babel/preset-typescript'],
      extensions,
    }),
    postcss({
      plugins: [autoprefixer(), tailwindcss()],
      extract: false,
      modules: false,
      autoModules: false,
      minimize: true,
      inject: false,
    }),
    // typescript({ sourceMap: true, inlineSources: false, tsconfig: './tsconfig.json' }),
    typescript({ inlineSources: false, tsconfig: './tsconfig.json' }),
    sourcemaps(),
    typescriptPaths({ preserveExtensions: true }),
    terser({ output: { comments: false } }),
    // If you want to see the live app
    ...(serveFiles ? servePlugins : []),
  ],
};

const configs = [
  {
    ...indexConfig,
    input: './src/web.ts',
    output: {
      sourcemap: true,
      file: 'dist/web.js',
      format: 'es',
    },
  },
];

export default configs;
