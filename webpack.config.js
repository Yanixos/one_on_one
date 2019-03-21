const path = require('path');

module.exports = {

    entry: './reactjs/src/index.js',
    output: {
        path: path.resolve(__dirname, './reactjs/dist'),
        filename: 'bundle.js',
    },

    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: [
                path.resolve(__dirname, './reactjs/src')
            ],
            options: {
                presets: ['react']
            },
        }],
    },

    devServer: {
        contentBase: path.resolve(__dirname, './reactjs/dist'),
        compress: true,
        port: 8080,
	      historyApiFallback: {
            rewrites: [
                { from: /./, to: '/app/index.html' }
            ],
        },
    }
};
