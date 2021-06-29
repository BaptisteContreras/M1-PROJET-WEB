const path = require('path');
const webpack = require("webpack");
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');

const { VueLoaderPlugin } = require('vue-loader')

config = {
    mode: 'production',
    devtool: 'source-map',
    entry: {
        'map'   : './src/indexMap.js',
        'main' : './src/index.js',
        'admin' : './src/indexAdmin.js',
        'sw' : './src/worker/sw_main.js'
    },
    output: {
        filename: '[name].js',
       // chunkFilename: '[name].chunk.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new CopyPlugin([
            { from: path.resolve(__dirname, 'src/img'), to: path.resolve(__dirname, 'dist/img') },
            { from: path.resolve(__dirname, 'src/manifest.json'), to: path.resolve(__dirname, 'dist') },
            { from: path.resolve(__dirname, 'src/worker/sw_main.js'), to: path.resolve(__dirname, 'dist') },
        ]),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "index.html",
            excludeChunks: ['admin','sw']
        }),
        new VueLoaderPlugin()
    ],
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.s(c|a)ss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        // Requires sass-loader@^7.0.0
                        options: {
                            implementation: require('sass'),
                            fiber: require('fibers'),
                            indentedSyntax: true // optional
                        },
                        // Requires sass-loader@^8.0.0
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                fiber: require('fibers'),
                                indentedSyntax: true // optional
                            },
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'file-loader',
                options : {
                    name: '[name].[ext]',
                },
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {'minimize' : true}
            },
        ],
    },
};
module.exports = config;
