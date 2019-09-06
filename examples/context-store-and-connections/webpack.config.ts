import { Configuration } from "webpack";
import * as path from "path";

const HtmlWebpackPlugin = require("html-webpack-plugin");

const MODE: string = (process.env.NODE_ENV || "development");
const PROJECT_ROOT: string = path.resolve(__dirname, "./");

// For development purposes only.
// Use proper config for production builds.
export class WebpackConfig implements Configuration {

  mode: "development" | "production" = MODE as any;

  resolve = {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  };

  entry = [
    path.resolve(PROJECT_ROOT, "src/main.tsx")
  ];

  output = {
    path: path.resolve(PROJECT_ROOT, "target/"),
    filename: "js/[name].bundle.js",
    sourceMapFilename: "js/map/[name].bundle.map"
  };

  devtool: "source-map" = "source-map";

  // Add the loader for .ts files.
  module = {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "awesome-typescript-loader",
        query: {
          configFileName: path.resolve(PROJECT_ROOT, "./tsconfig.json")
        }
      }
    ]
  };

  plugins = [
    new HtmlWebpackPlugin({
      inject: true,
      filename: "index.html",
      template: path.resolve(PROJECT_ROOT, "src/index.html")
    })
  ];

  devServer = {
    contentBase: "target/",
    historyApiFallback: true,
    compress: true,
    port: 3000,
    host: "0.0.0.0"
  }

}

export default new WebpackConfig();