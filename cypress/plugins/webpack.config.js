let path = require('path');

function root(p) {
  return path.resolve(`${__dirname}/../../${p}`);
}

module.exports = {
  mode: 'development',
  entry: root('rxidb.ts'),
  resolve: {
    modules: [
      root('node_modules'),
      root('./')
    ],
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  }
}
