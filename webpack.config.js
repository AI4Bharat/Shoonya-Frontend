const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");


module.exports = (env, argv) => {
  const isProduction = process.env.NODE_ENV === "production";
  

  return {
    mode: isProduction ? "production" : "development", // Switch mode
    devtool: isProduction ? "source-map" : "eval-source-map", // Better debugging in dev
    entry: "./src/index.js", // Main entry file
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[contenthash].js", // Cache-busting filenames
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          type: "asset/resource",
        },
      ],
    },
    optimization: isProduction
      ? {
          minimize: true,
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true,
                  dead_code: true,
                  passes: 3,
                },
                output: {
                  comments: false,
                },
              },
              parallel: true,
            }),
            new CssMinimizerPlugin(),
          ],
          splitChunks: {
            chunks: "all",
            minSize: 30 * 1024,
            maxSize: 250 * 1024,
            maxInitialRequests: 10,
          },
          runtimeChunk: "single",
        }
      : {}, // No optimization in dev mode
    plugins: [
        new CleanWebpackPlugin(), // Cleans up dist folder before each build
      new CompressionPlugin(), // Enable gzip only in production
      new BundleAnalyzerPlugin({
        analyzerMode: isProduction ? "disabled" : "server", // Enable bundle analysis in dev
      }),
    ],
    resolve: {
      extensions: [".js", ".jsx"],
    },
    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      compress: true,
      port: 3000, // Local dev server
      hot: true, // Enable HMR (Hot Module Replacement)
      open: true, // Auto-open browser
    },
  };
};
