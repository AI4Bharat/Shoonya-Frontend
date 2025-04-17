const { override, addWebpackPlugin, addWebpackModuleRule } = require("customize-cra");
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const addOptimizations = (config) => {
  if (config.mode === "production") {
    // Add MiniCssExtractPlugin
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
      })
    );

    // Add compression plugins (gzip and brotli)
    config.plugins.push(
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
      new BundleAnalyzerPlugin()
    );

    // Set optimization settings
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
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
      runtimeChunk: {
        name: "manifest",
      },
    };

    // Optional: Performance hint
    config.performance = {
      hints: "warning",
      assetFilter: (assetFilename) => assetFilename.endsWith(".js.gz"),
    };
  }

  return config;
};

const addExtraRules = () => (config) => {
  // Add custom rules like CSV and font loaders
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

const addExternals = () => (config) => {
  config.externals = {
    ...(config.externals || {}),
    "@heartexlabs/label-studio": "LabelStudio",
  };
  return config;
};

module.exports = override(
  addOptimizations,
  addExtraRules(),
  addExternals() 
);
