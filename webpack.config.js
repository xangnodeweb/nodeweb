// const path = require("path");
// const mode = process.env.NODE_ENV === "production" ? "production" : "development";

// module.exports = {
//  mode :  mode,
//  extry : path.resolve(__dirname , "src"),
//  output : {
//     filename : "bundle.js",
//     path : path.resolve(__dirname, "dist"),
//  },
//  module: {
//     rules : [
//         {
//         test : /\.jsx?$/,
//         exclude : /(node_modules|bower_components)/,
//         use : {
//             loader : "swc-loader"
//         },
//     },
//     {
//         test : /\.s[ac]ss$/i,
//         use : ["style-loader" , "css-loader" , "sass-loader"]
//     }
// ]}

// }

const path = require("path");
const mode = process.env.NODE_ENV === "production" ? "production" : "development";

module.exports = {
  mode: mode,
  entry: path.resolve(__dirname, "src"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "swc-loader",
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
   
  },

};