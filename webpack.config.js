const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");


module.exports = {
    entry: ['babel-polyfill',
        './src/js/chats.js'
    ],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "js/chatbot.bundle.js"
    },
    devServer: {
        contentBase: "./dist"
    },
    plugins: [
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: "./src/index.html"
        })
    ],
    module: {
        rules: [{
            test: /\.js$/,
            exclude: "/node_modules/",
            use: {
                loader: "babel-loader"
            }
        }]
    }
};