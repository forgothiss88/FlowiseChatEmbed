import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { sentryRollupPlugin } from '@sentry/rollup-plugin';
import autoprefixer from 'autoprefixer';
import livereload from 'rollup-plugin-livereload';
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import tailwindcss from 'tailwindcss';

const extensions = ['.ts', '.tsx'];

const serveFiles = process.env.ROLLUP_SERVE == 1;

const randomPort = Math.floor(Math.random() * 10000) + 10000;

const servePlugins = () => [
  serve({
    open: true,
    verbose: true,
    openPage: '/index.html',
    contentBase: '',
    host: '0.0.0.0',
    // host: 'localhost',
    port: randomPort,
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
    ...(serveFiles ? servePlugins() : []),
    sentryRollupPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'twini-srl',
      project: 'chatbot-fe',
    }),
  ],
};

const configs = [
  {
    ...indexConfig,
    input: './src/vironpopup.tsx',
    output: {
      sourcemap: true,
      file: 'dist/vironpopup.js',
      format: 'es',
    },
  },
  {
    ...indexConfig,
    input: './src/viron_chat_with_product.tsx',
    output: {
      sourcemap: true,
      file: 'dist/viron_chat_with_product.js',
      format: 'es',
    },
  },
];

export default configs;
