var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // Disabled for Production build - enable it locally for inspecting Webpack bundle size
var path = require('path');

var devMode = process.env.NODE_ENV !== 'production';
var ssrMode = process.env.SSR_MODE === 'true';

var devModeScssLoaders = [
  {
    loader: 'css-loader',
    query: { // TODO Change to "options" in final version 2 of Extract Text Webpack Plugin
      sourceMap: true,
      importLoaders: 1
    }
  },
  {
    loader: 'sass-loader',
    query: { // TODO Change to "options" in final version 2 of Extract Text Webpack Plugin
      sourceMap: true
    }
  }
];
var prodModeScssLoaders = [
  {
    loader: 'css-loader',
    query: { // TODO Change to "options" in final version 2 of Extract Text Webpack Plugin
      importLoaders: 1
    }
  },
  {
    loader: 'sass-loader'
  }
];

var devModeRTCssLoaders = [
  {
    loader: 'css-loader',
    query: { // TODO Change to "options" in final version 2 of Extract Text Webpack Plugin
      sourceMap: true,
      modules: true,
      importLoaders: 1,
      localIdentName: "[name]__[local]___[hash:base64:5]"
    }
  },
  {
    loader: 'postcss-loader'
    // Plugins are set in postcss.config.js
  }
];
var prodModeRTCssLoaders = [
  {
    loader: 'css-loader',
    query: { // TODO Change to "options" in final version 2 of Extract Text Webpack Plugin
      modules: true,
      importLoaders: 1,
      localIdentName: "[name]__[local]___[hash:base64:5]"
    }
  },
  {
    loader: 'postcss-loader'
    // Plugins are set in postcss.config.js
  }
];

var config = {
  entry: {
    app: './client/client.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['jsx-loader', 'babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        loaders: [
          {
            loader: 'babel-loader',
            query: {
              presets: ['es2015']
            }
          },
          {
            loader: 'react-svg-loader',
            query: {
              jsx: true
            }
          }
        ]
      },
      {
        test: /\.s?css$/,
        // TODO Change "loader" below to "use" in final version 2 of Extract Text Webpack Plugin
        loader: ssrMode ? "null-loader" : ExtractTextPlugin.extract({ fallbackLoader: "style-loader", loader: devMode ? devModeScssLoaders : prodModeScssLoaders }),
        /*exclude: /(node_modules)\/react-toolbox/*/
      },
      /*{
        test: /\.css$/,
        // TODO Change "loader" below to "use" in final version 2 of Extract Text Webpack Plugin
        loader: ssrMode ? "null-loader" : ExtractTextPlugin.extract({ fallbackLoader: "style-loader", loader: devMode ? devModeRTCssLoaders : prodModeRTCssLoaders }),
        include: /(node_modules)\/react-toolbox/
      },*/
      { test: /\.png$/, loader: "url-loader", options: { "limit": 10000, "mimetype": "image/png" } },
      { test: /\.gif$/, loader: "url-loader", options: { "limit": 10000, "mimetype": "image/gif" } },
      { test: /\.txt$/, use: 'raw-loader' },
      { test: /\.jpe?g$/, loader: "url-loader", options: { "limit": 10000, "mimetype": "image/jpeg" } }
    ]
  },
  node: {
    fs: 'empty',
      // tls: 'empty'
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ].concat(ssrMode ? [
    new webpack.IgnorePlugin(/^pixi\.js$/),
    new webpack.IgnorePlugin(/^ag-grid-enterprise$/),
    new webpack.IgnorePlugin(/^ag-grid-react$/)
  ] : [
    new ExtractTextPlugin({ filename: "styles.css" })
  ]).concat(!devMode && !ssrMode ? [
    // new BundleAnalyzerPlugin(), // Disabled for Production build - enable it locally for inspecting Webpack bundle size
    new webpack.DefinePlugin({ // <-- key to reducing React's size
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    // new webpack.optimize.UglifyJsPlugin(), // Minify everything
    new webpack.optimize.AggressiveMergingPlugin(), // Merge chunks
    new CompressionPlugin({ // Compress bundle.js and styles.css
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ] : []),
  externals: {
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },

};

if (devMode) {
  config.devtool = "eval-cheap-module-source-map";
  config.devServer = { port: 8089 };
}

if (ssrMode) {
  config.entry.app = "./index.js";
  config.target = "node";
  config.output.filename = "server.js";
  config.externals = {
    "fsevents": true
  };
}

module.exports = config;
