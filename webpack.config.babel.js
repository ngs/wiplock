/*eslint-disable no-process-env */
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

process.env.DEV_SERVER = 1;
const serverProcess = spawn('./wiplock');
process.on('exit', () => serverProcess.kill());

if (devServer) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  entries.push('webpack/hot/dev-server');
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
    historyApiFallback: true,
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
