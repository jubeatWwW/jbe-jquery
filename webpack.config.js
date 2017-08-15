let webpack = require('webpack');
let path = require('path');

let config = {
    entry: [
        'babel-polyfill',
        './src/jbe.js'
    ],
    output: {
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'es2015', 'es2017']
                    }
                }
            },
            {
                test: /\.css/,
                exclude: /(node_modules|bower_components)/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],
    devServer: {
        host: '0.0.0.0',
        hot: true,
        contentBase: path.join(__dirname, ''),
        disableHostCheck: true
    }
}

module.exports = config;
