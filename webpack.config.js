let path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

function root(p) {
  return path.resolve(`${__dirname}/${p}`);
}

module.exports = function (env) {
  return {
    entry     : root('rxidb.ts'),
    externals : [
      'rxjs',
      'rxjs/operators'
    ],
    output: {
      path          : root('dist'),
      filename      : 'rxidb.js',
      library       : 'rxidb',
      libraryTarget : 'umd',
    },
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
              loader: 'ts-loader',
              options: {
                configFile: root('tsconfig.build.json'),

              }
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
  };
}
