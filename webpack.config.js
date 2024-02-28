const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/pf-iframe.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'pf-iframe.min.js',
    path: path.resolve(__dirname, 'dist/prod/'),
  },
};
