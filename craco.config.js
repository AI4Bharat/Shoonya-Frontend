const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { whenProd } = require('@craco/craco');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Mode and Devtool
      webpackConfig.mode = env === 'production' ? 'production' : 'development';
      webpackConfig.devtool = env === 'production' ? 'source-map' : 'eval-source-map';

      // Output configuration
      webpackConfig.output = {
        ...webpackConfig.output,
        filename: whenProd(
          () => '[name].[contenthash].js',
          '[name].js'
        ),
        chunkFilename: whenProd(
          () => '[name].[contenthash].js',
          '[name].js'
        ),
        publicPath: '/',
        clean: true,
        path: path.resolve(__dirname, 'build') // Match CRA's default output path
      };

      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        usedExports: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true,
                drop_debugger: true,
                dead_code: true,
                passes: 3,
                pure_funcs: ['console.log', 'console.info']
              },
              output: {
                comments: false
              }
            },
            parallel: true
          })
        ],
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          maxSize: 244 * 1024,
          minSize: 30 * 1024,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all'
            }
          }
        }
      };

      return webpackConfig;
    },
    plugins: {
      add: [
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css',
          chunkFilename: '[id].[contenthash].css'
        }),
        new CompressionPlugin({
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: /\.(js|css|html|svg|json)$/,
          threshold: 1024,
          minRatio: 0.8,
          deleteOriginalAssets: false
        }),
        new CompressionPlugin({
          filename: '[path][base].br',
          algorithm: 'brotliCompress',
          test: /\.(js|css|html|svg|json)$/,
          compressionOptions: { level: 11 },
          threshold: 1024,
          minRatio: 0.8,
          deleteOriginalAssets: false
        })
      ]
    }
  },
};