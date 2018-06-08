let path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

function root(p) {
  return path.resolve(`${__dirname}/${p}`);
}

module.exports = {
  entry     : root('rxidb.ts'),
  externals : /^(rxjs)/,
  output: {
    path     : root('dist'),
    filename : 'rxidb.js'
  },
  devtool: 'inline-source-map',
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
        test    : /\.ts$/,
        exclude : [/node_modules/],
        use     : [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode   : 'static',
      reportFilename : root('bundleReport.html'),
      openAnalyzer   : false
    })
  ]
}
