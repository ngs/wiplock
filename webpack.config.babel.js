/*eslint-disable no-process-env */
import fs from 'fs';
import autoprefixer from 'autoprefixer';
import bootstrap from 'bootstrap-styl';
import cssMqpacker from 'css-mqpacker';
import flexboxfixer from 'postcss-flexboxfixer';
import nib from 'nib';
import packagejson from './package.json';
import path from 'path';
import webpack from 'webpack';
import { spawn } from 'child_process';

const version = packagejson.version;
const devServer = /webpack\-dev\-server$/.test(process.env._);
const buildDir = path.join(__dirname, 'assets', 'build');
const srcDir = path.join(__dirname, 'assets', 'src');

const entries = ['babel-polyfill', path.join(srcDir, 'index.js')];
const cssLoader = devServer ? 'css' : 'css?minimize';
const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      VERSION: JSON.stringify(version)
    }
  })
];

if (devServer) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  entries.push('webpack/hot/dev-server');

  let serverProcess = null;

  function startServer() {
    // process.env.DEV_SERVER = 1;
    const buildProcess = spawn('npm', ['run', 'go:build']);
    console.info(`[go:build#${buildProcess.pid}] Starting`);
    buildProcess.on('close', (code) => {
      if (code === 0) {
        serverProcess = spawn('./wiplock', [], {
          env: Object.assign({ DEV_SERVER: 1 }, process.env)
        });
        console.info(`[server#${serverProcess.pid}] Starting`);
        serverProcess.stdout.on('data', (data) => {
          console.log(`[server:error#${serverProcess.pid}] ${data}`);
        });
        serverProcess.stdout.on('error', (data) => {
          console.error(`[server#${serverProcess.pid}:error] ${data}`);
        });
      } else {
        console.error(`[go:build#${buildProcess.pid}] exited with status ${code}`)
      }
    })
    buildProcess.stdout.on('data', (data) => {
      console.log(`[go:build#${buildProcess.pid}] ${data}`);
    });
    buildProcess.stdout.on('error', (data) => {
      console.error(`[go:build#${buildProcess.pid}:error] ${data}`);
    });
  }

  function stopServer() {
    if (serverProcess) {
      serverProcess.kill();
    }
    serverProcess = null;
  }

  function restartServer() {
    stopServer();
    startServer();
  }

  fs.watch('./app', (event, filename) => {
    if (/.+\.go$/.test(filename)) {
      console.info(event, filename);
      restartServer();
    }
  });
  process.on('exit', stopServer);
  setTimeout(startServer, 1);

} else {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      output: {
        ascii_only: true
      }
    })
  );
}

export default {
  cache: true,
  entry: entries,
  output: {
    path: buildDir,
    filename: 'bundle.js',
    publicPath: '/assets'
  },
  display: { errorDetails: true },
  resolveLoader: {
    modulesDirectories: ['node_modules', srcDir]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules', srcDir]
  },
  module:{
    preLoaders: [
      { test: /\.jsx?$/, loader: 'eslint-loader', exclude: /node_modules/ },
      { test: /\.styl?$/, loader: 'stylint-loader', exclude: /node_modules/ }
    ],
    loaders: [
      { test: /\.(eot|ttf|svg)(\?.+)?$/, loaders: ['file'] },
      { test: /\.styl$/, loaders: ['style', cssLoader, 'postcss', 'stylus'] },
      { test: /\.css$/, loaders: ['style', cssLoader] },
      { test: /\.jsx?$/, loaders: ['babel'], exclude: /node_modules/ },
      { test: /\.json$/, loaders: ['json'] },
      { test: /\.(jpg|woff|woff2|png|gif|mp3$)/, loaders: ['url?limit=102400'] }
    ]
  },
  plugins,
  postcss: () => {
    return [autoprefixer, flexboxfixer, cssMqpacker];
  },
  eslint: { configFile: '.eslintrc' },
  stylus: {
    use: [bootstrap(), nib()]
  },
  devServer: {
    historyApiFallback: false,
    contentBase: buildDir,
    hot: true,
    inline: true,
    publicPath: '/assets/',
    proxy: {
      '/api/*': 'http://localhost:8000',
      '/': 'http://localhost:8000'
    }
  },
  devtool: devServer ? '#cheap-module-inline-source-map' : null
};
