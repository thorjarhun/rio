module.exports = {
    entry: './client/index.jsx',
    output: {
        path:__dirname+'/public',
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js.?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['','.js','.jsx']
    }
};
