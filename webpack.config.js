const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');


const PATHS = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build'),
};

const common = {
  entry: {
    src: PATHS.src
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js',
    sourceMapFilename: "[file].js.map"
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: PATHS.src
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.src
      },
      {
        test: /\.hbs$/,
        loader: "handlebars-loader"
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "postcss", "sass"]
      },
      {
        test: /\.(jpg|png)$/,
        loader: "file-loader"
      },
      { // Fonts
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file?name=public/fonts/[name].[ext]'
      }
    ]
  },

  postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ]
};

var devConfig = merge(common, {
  devServer: {
    proxy: {
      '/api/*': {
        target: 'http://localhost:3000'
      }
    },
    contentBase: PATHS.build,
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    stats: 'errors-only',
    host: process.env.HOST,
    port: process.env.PORT || 3030
  },

  devtool: 'eval',

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});

module.exports = devConfig;
