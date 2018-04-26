let path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

function root(p) {
  return path.resolve(`${__dirname}/${p}`);
}

module.exports = {
  entry: root('index.ts'),
  externals: /^(rxjs|idb)/,
  output: {
    path              : root('dist'),
    filename          : 'rxidb.js'
  },
  devtool: 'inline-source-map',
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'all',
          name: 'vendor',
          enforce: true,
          test: /node_modules/
        }
      }
    }
  },
  resolve: {
    modules: [
      root('node_modules'),
      root('src')
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
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: root('bundleReport.html'),
      openAnalyzer: true
    })
  ]
}
