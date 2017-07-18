module.exports = {
  entry: './src/client/app/index.js',
  output: {
    filename: 'app.js',
    path: './src/client/public'
  },
  module: {
	loaders: [
		{ 
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: {
				presets: ['es2015']
			}
		}
	],
  }
};