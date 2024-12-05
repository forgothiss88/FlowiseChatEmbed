import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import autoprefixer from 'autoprefixer';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import livereload from 'rollup-plugin-livereload';
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import tailwindcss from 'tailwindcss';

const extensions = ['.ts', '.tsx'];

const serveFiles = process.env.SERVE == 'true';
const env = process.env.NODE_ENV || 'local';

console.log('serveFiles', serveFiles);
console.log('env', env);

const randomPort = 12345;

const servePlugins = () => [
  serve({
    open: true,
    verbose: true,
    openPage: '/chat_with_product.html',
    contentBase: '',
    host: '0.0.0.0',
    port: randomPort,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  }),
  livereload('dist'),
];

const pluginsConfig = (serveFiles) => [
  resolve({ extensions, browser: true }),
  commonjs(),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    presets: ['solid', '@babel/preset-typescript'],
    extensions,
  }),
  postcss({
    include: ['src/**/*.css', 'src/**/*.scss'],
    plugins: [autoprefixer(), tailwindcss({ config: './tailwind.config.js' })],
    extract: false, // will be used as inline style
    // minimize: true,
    use: ['sass'],
  }),
  typescript({ inlineSources: false, tsconfig: './tsconfig.json' }),
  ...(serveFiles ? [sourcemaps()] : []),
  typescriptPaths({ preserveExtensions: true }),
  terser({ output: { comments: false } }),
  // If you want to see the live app
  ...(serveFiles ? [servePlugins()] : []),
  injectProcessEnv({
    NODE_ENV: env,
  }),
];

const configs = [
  {
    input: './src/vironpopup.tsx',
    output: {
      sourcemap: true,
      file: 'dist/vironpopup.js',
      format: 'es',
    },
    plugins: pluginsConfig(serveFiles),
  },
  {
    input: './src/flerpopup.tsx',
    output: {
      sourcemap: true,
      file: 'dist/flerpopup.js',
      format: 'es',
    },
    plugins: pluginsConfig(serveFiles),
  },
];

export default configs;
