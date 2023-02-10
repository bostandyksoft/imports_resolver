const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    devtool: 'source-map',
    mode: 'production',
    target: ['es5'],
    resolve: {
        extensions: ['.ts']
    },
    output: {
        chunkFormat: 'commonjs',
        filename: 'index.js',
        path: path.resolve(__dirname, 'lib'),
        library: {
            type: 'commonjs'
        }
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [
                'babel-loader',
                'ts-loader'
            ]
        }]
    },
    optimization: {
        minimizer: [
            new TerserPlugin()
        ]
    }
};