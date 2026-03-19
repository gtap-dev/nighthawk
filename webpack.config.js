const path = require('path');

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
        clean: true,
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/theme.css',
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: './assets/img/**/*',
                    to: 'img/[name][ext]',
                },
                {
                    from: './assets/favicon.ico',
                    to: '[name][ext]',
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
                loader: 'expose-loader',
                options: {
                    exposes: ['$', 'jQuery'],
                },
            },
            {
                test: /\.(woff|woff2)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]',
                },
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name][ext]',
                },
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
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
                            postcssOptions: {
                                plugins: [
                                    require('autoprefixer')(),
                                ],
                            },
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
                            api: 'modern-compiler',
                            sourceMap: true,
                            sassOptions: {
                                loadPaths: [
                                    path.resolve(__dirname, 'node_modules'),
                                ],
                            },
                        }
                    }
                ]
            },
        ],
    },
};
