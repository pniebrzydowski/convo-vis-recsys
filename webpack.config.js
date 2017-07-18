const path = require('path');

module.exports = {
  entry: './src/client/app/index.js',
  output: {
    filename: 'app.js',
    path: path.join(__dirname, 'src/client/public')
  },
  module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}
		],
  }
};