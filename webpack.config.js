
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
   mode: 'production',
  //mode: 'development',
  //devtool: 'inline-source-map',
  devtool: 'source-map',

  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean:true
  },
  resolve: {
    extensions: ['.js', '.jsx']
   },

  plugins: [
    new MiniCssExtractPlugin({       filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css'
 }),

    new HtmlWebpackPlugin({
      template: './public/index.html',

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


  ],
  performance: {
    maxAssetSize: 244 * 1024, // 244KB
    maxEntrypointSize: 244 * 1024,
    hints: 'warning',
    assetFilter: function(assetFilename) {
      return assetFilename.endsWith('.js.gz') || assetFilename.endsWith('.css.gz');
    }
  },

  module: {
    rules: [
    
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },

      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
      },
      
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(csv|tsv)$/i,
        use: ['csv-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"
      , "@babel/preset-react"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      }
      

    ],
  },
  optimization: {
    usedExports: true,
    minimizer: [
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true,  // Removes console.log
                  drop_debugger: true, // Removes debugger statements
                  dead_code: true,     // Removes unused code
                  passes: 3,           // Apply multiple optimizations
                   pure_funcs: ['console.log', 'console.info'], // Delete console

                  },
                output: {
                  comments: false,
                },
              },
              parallel: true,
            }),
            // new CssMinimizerPlugin(),
          ],
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      maxSize: 244 * 1024, // 244KB target
      minSize: 30 * 1024, // 30KB minimum
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },

    },
    runtimeChunk: {
      name: "manifest",
    },


  },

};



















// assets by status 5.6 MiB [cached] 4 assets
// asset index.html 3 KiB [compared for emit] 1 related asset
// Entrypoint main 5.6 MiB (839 bytes) = manifest.0326e5c3fc4ad698dde7.js 19.6 KiB vendors.e4ae8269cd7cedc7f66f.js 5.07 MiB main.4e184ef5d9cdc3072d0c.js 519 KiB 1 auxiliary asset
// orphan modules 1.85 MiB [orphan] 871 modules
// runtime modules 4.95 KiB 10 modules
// cacheable modules 1.99 MiB (javascript) 839 bytes (asset)
//   modules by path ./node_modules/ 1.87 MiB 236 modules
//   modules by path ./src/ 115 KiB (javascript) 839 bytes (asset)
//     modules by path ./src/redux/reducers/ 71.1 KiB 102 modules
//     modules by path ./src/*.js 12.9 KiB
//       ./src/index.js 897 bytes [built] [code generated]
//       ./src/web.route.js 11.7 KiB [built] [code generated]
//       ./src/reportWebVitals.js 427 bytes [built] [code generated]
//     modules by path ./src/ui/ 17 KiB
//       ./src/ui/theme/theme.js 11.7 KiB [built] [code generated]
//       ./src/ui/Layout.js 2.8 KiB [built] [code generated]
//       ./src/ui/styles/LayoutStyles.js 2.5 KiB [built] [code generated]
//     + 6 modules






// assets by status 343 KiB [cached] 5 assets
// Entrypoint main = manifest.945f63cb8938d2856dc6.js vendors.24d0506d247c2cb0a192.js main.a8020f082f83da5cf22c.js 4 auxiliary assets
// orphan modules 2.3 MiB [orphan] 1155 modules
// runtime modules 5.68 KiB 9 modules
// cacheable modules 947 KiB (javascript) 839 bytes (asset)
//   modules by path ./node_modules/ 831 KiB 61 modules
//   modules by path ./src/ 115 KiB (javascript) 839 bytes (asset)
//     ./src/index.js + 113 modules 115 KiB [built] [code generated]
//     ./src/assets/Card.svg 839 bytes (asset) 42 bytes (javascript) [built] [code generated]



















// const path = require("path");
// const glob = require("glob");
// const TerserPlugin = require("terser-webpack-plugin");
// const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// const CompressionPlugin = require("compression-webpack-plugin");
// // const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
// // const {Critters} = require('critters-webpack-plugin');

// const isProduction = process.env.NODE_ENV === "production";

// module.exports = {
//   mode: isProduction ? "production" : "development", // Switch mode
//   devtool: isProduction ? "source-map" : "eval-source-map", // Better debugging in dev
//   entry: "./src/index.js", // Main entry file
//   output: {
//     path: path.resolve(__dirname, "dist"),
//     filename: "[name].[contenthash].js", // Cache-busting filenames
//     clean: true,
//   },
//   module: {
//     rules: [
//       {
//         test: /\.(js|jsx)$/,
//         exclude: /node_modules/,
//         use: {
//           loader: "babel-loader",
//           options: {
//             presets: ["@babel/preset-env", "@babel/preset-react"],
//             plugins: ["@babel/plugin-transform-runtime"], // Reduce duplication in bundle

//           },

//         },
//       },
//       {
//         test: /\.css$/,
//         use: [
//           "style-loader",
//           "css-loader",
//           {
//             loader: "postcss-loader",
//             options: {
//               postcssOptions: {
//                 plugins: [
//                   ["autoprefixer", { overrideBrowserslist: [">1%", "last 2 versions"] }]
//                 ]
//               }
//             }
//           }
//         ]
//       }
//       ,
//       {
//         test: /\.(png|jpe?g)$/,
//         use: [
//           {
//             loader: "image-webpack-loader",
//             options: {
//               mozjpeg: { progressive: true },
//               webp: { quality: 80 },
//             },
//           },
//         ],
//       },
//       {
//         test: /\.(png|jpg|gif|svg)$/,
//         type: "asset/resource",
//       },
//     ],
//   },
//   optimization: {
//     usedExports: true,  
//     sideEffects: false, // Enable tree-shaking

//     minimize: true,
//     minimizer: [
//       new TerserPlugin({
//         terserOptions: {
//           compress: {
//             drop_console: true,  // Removes console.log
//             drop_debugger: true, // Removes debugger statements
//             dead_code: true,     // Removes unused code
//             passes: 3,           // Apply multiple optimizations
//             },
//           output: {
//             comments: false,
//           },
//         },
//         parallel: true,
//       }),
//       new CssMinimizerPlugin(),
//     ],
//     splitChunks: {
//       chunks: "all",
//     minSize: 30 * 1024,
//     maxSize: 150 * 1024, // Reduce chunk size
//     automaticNameDelimiter: "-",
//     maxInitialRequests: 5,
//     cacheGroups: {
//       vendor: {
//         test: /[\\/]node_modules[\\/]/,
//         name: "vendors",
//         chunks: "all",
//       },
//       commons: {
//         test: /[\\/]src[\\/]/,
//         name: "commons",
//         chunks: "all",
//         minChunks: 2,
//       },
//     },
//     },
//     runtimeChunk: "single",
//   },
//   plugins: [
//     new CleanWebpackPlugin(), // Cleans up dist folder before each build
    // new CompressionPlugin({
    //   algorithm: "brotliCompress", // Use Brotli for better compression
    //   threshold: 1024, // Compress files larger than 10KB
    //   minRatio: 0.8,
    //   test: /\.(js|css|html|svg)$/,
    // }),
//     // new BundleAnalyzerPlugin({
//     //   analyzerMode: "static", // Change to 'server' if needed
//     //   reportFilename: "bundle-report.html", // Output report filename
//     //   generateStatsFile: true, // Enable stats.json generation
//     //   statsFilename: "stats.json", // Ensure it saves stats.json
//     // }),
//     // new Critters({
//     //   preload: 'swap',
//     //   fonts: true,
//     // }),
    
//     new PurgeCSSPlugin({
//       paths: glob.sync(`${path.resolve(__dirname, "src")}/**/*`, { nodir: true }),
//       safelist: {
//         standard: [/^slick-/], // Add any necessary safelist patterns
//         deep: [/modal-backdrop/, /tooltip/], // For dynamic classes
//         greedy: [/dropdown-menu$/] // For parent selectors
//       },
//       // Add these for better coverage
//       extractors: [
//         {
//           extractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
//           extensions: ['html', 'js', 'jsx'],
//         },
//       ],
//     }),
//   ],
//   resolve: {
//     extensions: [".js", ".jsx"],
//   },
//   devServer: {
//     static: {
//       directory: path.join(__dirname, "dist"),
//     },
//     compress: true,
//     port: 3000, // Local dev server
//     hot: true, // Enable HMR (Hot Module Replacement)
//     open: true, // Auto-open browser
//     watchFiles: ["src/**/*"], // Watch only necessary files
//     watchOptions: {
//       ignored: /node_modules/, // Ignore unnecessary files
//       aggregateTimeout: 300, // Delay rebuilds slightly for efficiency
//       poll: 1000, // Set polling interval
//     },  
//   },
// };
