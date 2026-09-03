const CopyWebpackPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCSSExtractPlugin = require("mini-css-extract-plugin")
const path = require("path")

module.exports = {
  entry: {
    main: path.resolve(__dirname, "../src/variation.js"),
    variation: path.resolve(__dirname, "../src/index.js")
  },
  output: {
    filename: "bundle.[contenthash].js",
    path: path.resolve(__dirname, "../dist")
  },
  devtool: "source-map",
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, "../static"), noErrorOnMissing: true }]
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/variation.html"),
      minify: true,
      chunks: ["main"]
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
      filename: "variation/index.html",
      minify: true,
      chunks: ["variation"]
    }),
    new MiniCSSExtractPlugin()
  ],
  module: {
    rules: [
      // HTML
      {
        test: /\.(html)$/,
        use: ["html-loader"]
      },

      // JS
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },

      // CSS
      {
        test: /\.css$/,
        use: [MiniCSSExtractPlugin.loader, "css-loader"]
      },

      // Images
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "assets/images/"
            }
          }
        ]
      },

      // Models
      {
        test: /\.(glb|gltf|bin)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "assets/models/",
              esModule: false
            }
          }
        ]
      },

      // Fonts
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "assets/fonts/"
            }
          }
        ]
      }
    ]
  }
}
