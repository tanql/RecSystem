const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');

const PATHS = {
    src: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build')
};

module.exports = {
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
                test: /\.(jpg|png)$/,
                loader: "file-loader"
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "postcss", "sass"]
            },
            { // Fonts
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file?name=public/fonts/[name].[ext]'
            }
        ]
    },
    postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};
