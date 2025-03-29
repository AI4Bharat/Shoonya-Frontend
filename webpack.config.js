const path = require("path");
const glob = require("glob");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProduction ? "production" : "development", // Switch mode
  devtool: isProduction ? "source-map" : "eval-source-map", // Better debugging in dev
  entry: "./src/index.js", // Main entry file
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js", // Cache-busting filenames
    clean: true,
  },
  performance: {
    maxAssetSize: 250 * 1024, // 250KB
    maxEntrypointSize: 250 * 1024,
    hints: isProduction ? "error" : "warning",
    assetFilter: function(assetFilename) {
      return !assetFilename.endsWith(".map");
    }
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
            plugins: ["@babel/plugin-transform-runtime"], // Reduce duplication in bundle

          },

        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|webp)$/,
        use: [
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: { progressive: true },
              optipng: { optimizationLevel: 5 },
        pngquant: { quality: [0.65, 0.90], speed: 4 },
        webp: { quality: 75 },
        avif: { quality: 50 },

            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: "asset/resource",
      },
    ],
  },
  optimization: {
    usedExports: true,  
    minimize: true,
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',  
    sideEffects: false, // Ensures unused modules are dropped
    concatenateModules: true, // Scope hoisting for smaller output
    concatenateModules: true,
    emitOnErrors: false,
    innerGraph: true,
    realContentHash: true,
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    flagIncludedChunks: true,
  
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            ecma: 5,
          warnings: false,
          comparisons: false,
          inline: 2,
            drop_console: true,  // Removes console.log
            drop_debugger: true, // Removes debugger statements
            dead_code: true,     // Removes unused code
            passes: 5,           // Apply multiple optimizations
            },
            parse: {
              ecma: 8,
            },
            mangle: {
              safari10: true,
            },
     // Reduce variable names

          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
  
          },
        },
        parallel: true,
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: "all",
    minSize: 30 * 1024,
    maxSize: 150 * 1024, // Reduce chunk size
    automaticNameDelimiter: "-",
    maxInitialRequests: 5,
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: "vendors",
        chunks: "all",
      },
      commons: {
        test: /[\\/]src[\\/]/,
        name: "commons",
        chunks: "all",
        minChunks: 2,
      },
    },
    },
    runtimeChunk: "single",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      minify: isProduction,
      inject: true,
      preload: "**/*.{css,js}",
      prefetch: "**/lazy-*.{css,js}"
    }),
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 1024,
      minRatio: 0.8,
    }),
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      threshold: 1024,
      minRatio: 0.8,
      compressionOptions: { level: 11 }, // Max Brotli compression
    }),
    
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.resolve(__dirname, "src")}/**/*`, { nodir: true }),
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
    watchFiles: ["src/**/*"], // Watch only necessary files
    watchOptions: {
      ignored: /node_modules/, // Ignore unnecessary files
      aggregateTimeout: 300, // Delay rebuilds slightly for efficiency
      poll: 1000, // Set polling interval
    },  
  },
};
