const path = require('path');
const fs = require('fs');

const translationFiles = fs.readdirSync(path.resolve(__dirname, 'src', 'translations'));
const entry = { 'pf-iframe': './src/pf-iframe.ts' };

translationFiles.forEach(file => {
  const name = path.basename(file, '.ts');
  entry[`translations/${name}`] = `./src/translations/${file}`;
});

module.exports = {
  mode: 'production',
  entry: entry, // Use the dynamically generated entry object
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
    filename: '[name].min.js', // Use the entry name in the filename
    path: path.resolve(__dirname, 'dist/prod/'),
  },
};
