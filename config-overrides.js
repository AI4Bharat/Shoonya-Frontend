const { override, addWebpackPlugin, addWebpackModuleRule } = require("customize-cra");
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const addBabelPreset = require("customize-cra").addBabelPreset;


const addModernBabelPreset = () =>
  addBabelPreset([
    "@babel/preset-env",
    {
      targets: {
        browsers: [
          "last 2 versions",
          "not ie < 11",
          "not dead"
        ]
      },
      useBuiltIns: "usage",
      corejs: 3,
      modules: false,
      debug: false
    }
  ]);

const addOptimizations = (config) => {
  if (config.mode === "production") {

    config.plugins.push(
       new MiniCssExtractPlugin({
        filename: "css/[name].[contenthash].css",
        chunkFilename: "css/[id].[contenthash].css",
        experimentalUseImportModule: true, 
            }),
      new CompressionPlugin({
        filename: "[path][base].gz",
        algorithm: "gzip",
        test: /\.(js|css|html|svg|json)$/,
        threshold: 1024,
        minRatio: 0.8,
        deleteOriginalAssets: false,
      }),
      new CompressionPlugin({
        filename: "[path][base].br",
        algorithm: "brotliCompress",
        compressionOptions: { level: 11 },
        test: /\.(js|css|html|svg|json)$/,
        threshold: 1024,
        minRatio: 0.8,
        deleteOriginalAssets: false,
      }),
      new BundleAnalyzerPlugin({
          analyzerMode: "static",
          reportFilename: "report.html",
          openAnalyzer: true,
        })
          );

      config.optimization = {
        ...config.optimization,
        usedExports: true,
        moduleIds: "deterministic",
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true,
                drop_debugger: true,
                dead_code: true,
                passes: 3,
                pure_funcs: ["console.log", "console.info"],
              },
              output: {
                comments: false,
              },
            },
            parallel: true,
          }),
        ],
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          automaticNameDelimiter: '~',
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              name: 'vendors',
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            quill: {
              test: /[\\/]node_modules[\\/]quill[\\/]/,
              name: 'quill',
              chunks: 'all',
              priority: 5,
            },
            lodash: {
              test: /[\\/]node_modules[\\/]lodash[\\/]/,
              name: 'lodash',
              chunks: 'all',
              priority: 5,
            },
          }
        },
        runtimeChunk: {
          name: "manifest",
        },
      }
      config.performance = {
        hints: "warning",
        assetFilter: (assetFilename) => assetFilename.endsWith(".js.gz"),
    };
  }

  return config;
};

const addExtraRules = () => (config) => {
  config.module.rules.push(
    {
      test: /\.(csv|tsv)$/i,
      use: ["csv-loader"],
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: "asset/resource",
    }
  );

  return config;
};

module.exports = override(
  addModernBabelPreset(),
  addOptimizations,
  addExtraRules(),
);
