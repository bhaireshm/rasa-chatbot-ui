const path = require('path');

module.exports = {
    entry: './src/js/chats.js',
    module: {
        rules: [{
            test: /\.txt$/,
            use: 'raw-loader'
        }]
    },
    output: {
        filename: 'chatbot.bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};