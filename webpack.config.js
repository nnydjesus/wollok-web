var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
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
        exclude: /(node_modules)\/react-toolbox/
      },
      {
        test: /\.css$/,
        // TODO Change "loader" below to "use" in final version 2 of Extract Text Webpack Plugin
        loader: ssrMode ? "null-loader" : ExtractTextPlugin.extract({ fallbackLoader: "style-loader", loader: devMode ? devModeRTCssLoaders : prodModeRTCssLoaders }),
        include: /(node_modules)\/react-toolbox/
      },
      { test: /\.png$/, loader: "url-loader", options: { "limit": 10000, "mimetype": "image/png" } },
      { test: /\.jpe?g$/, loader: "url-loader", options: { "limit": 10000, "mimetype": "image/jpeg" } },
      { test: /\.gif$/, loader: "url-loader", options: { "limit": 10000, "mimetype": "image/gif" } },
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  node: {
    fs: 'empty',
      // tls: 'empty'
  },
  plugins: ssrMode ? [] : [
    new ExtractTextPlugin({ filename: "styles.css" })
  ],
  externals: {
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  }
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
