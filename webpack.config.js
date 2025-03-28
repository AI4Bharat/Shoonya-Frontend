const path = require("path");
const glob = require("glob");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
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
        test: /\.(png|jpe?g)$/,
        use: [
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: { progressive: true },
              webp: { quality: 80 },
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
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,  // Removes console.log
            drop_debugger: true, // Removes debugger statements
            dead_code: true,     // Removes unused code
            passes: 3,           // Apply multiple optimizations
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
    new CleanWebpackPlugin(), // Cleans up dist folder before each build
    new CompressionPlugin({
      algorithm: "brotliCompress", // Use Brotli for better compression
      threshold: 1024, // Compress files larger than 10KB
      minRatio: 0.8,
      test: /\.(js|css|html|svg)$/,
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: "static", // Change to 'server' if needed
    //   reportFilename: "bundle-report.html", // Output report filename
    //   generateStatsFile: true, // Enable stats.json generation
    //   statsFilename: "stats.json", // Ensure it saves stats.json
    // }),
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
