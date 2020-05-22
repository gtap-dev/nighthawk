const path = require('path');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const globImporter         = require('node-sass-glob-importer');
const CopyPlugin           = require('copy-webpack-plugin');



module.exports = {
    entry: {
        main: [
            './assets/js/mandelbrot.js',
            './assets/scss/theme.scss',
        ],
    },
    output: {
        filename: 'js/mandelbrot.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/theme.css',
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: './assets/img/**/*',
                    to: './img',
                    flatten: true,
                },
                {
                    from: './assets/favicon.ico',
                    to: '.'
                },
            ],
        }),
        // new BundleAnalyzerPlugin(),
    ],
    resolve: {
        // fix issues with duplicate dependencies in linked modules
        symlinks: false,
        modules: [
            path.resolve('node_modules')
        ],
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery'
                }, {
                    loader: 'expose-loader',
                    options: '$'
                }]
            },
            {
                test: /\.(woff|woff2)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]'
                    }
                }]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name].[ext]'
                    }
                }]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            plugins: [
                                require('autoprefixer')()
                            ]
                        }
                    },
                    {
                        loader: 'resolve-url-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                importer: globImporter(),
                            },
                        }
                    }
                ]
            },
        ],
    },
};
