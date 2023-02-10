const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    devtool: 'source-map',
    mode: 'production',
    resolve: {
        extensions: ['.ts']
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            type: 'commonjs'
        }
    },
    plugins: [new CleanWebpackPlugin()],
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
        sideEffects: false,
    }
};