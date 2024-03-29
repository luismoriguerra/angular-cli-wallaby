var wallabyWebpack = require('wallaby-webpack');
var path = require('path');

var compilerOptions = Object.assign(
  require('./src/tsconfig.app.json').compilerOptions,
  require('./src/tsconfig.spec.json').compilerOptions);

module.exports = function (wallaby) {

  var webpackPostprocessor = wallabyWebpack({
    entryPatterns: [
      'src/wallabyTest.js',
      'src/**/*spec.js',
      'projects/**/*spec.js'
    ],

    module: {
      rules: [
        {test: /\.css$/, loader: ['raw-loader']},
        {test: /\.html$/, loader: 'raw-loader'},
        {test: /\.ts$/, loader: '@ngtools/webpack', include: /node_modules/, query: {tsConfigPath: 'src/tsconfig.app.json'}},
        {test: /\.js$/, loader: 'angular2-template-loader', exclude: /node_modules/},
        {test: /\.styl$/, loaders: ['raw-loader', 'stylus-loader']},
        {test: /\.less$/, loaders: ['raw-loader', {loader: 'less-loader'}]},
        {
          test: /\.scss$|\.sass$/,
          loaders: [
            {loader: 'raw-loader'},
            {loader: 'sass-loader', options: {includePaths: ['./src'], implementation: require('sass')}}]},
        {test: /\.(jpg|png|svg)$/, loader: 'raw-loader'}
      ]
    },

    resolve: {
      extensions: ['.js', '.ts'],
      modules: [
        path.join(wallaby.projectCacheDir, 'projects'),
        path.join(wallaby.projectCacheDir, 'src/app'),
        path.join(wallaby.projectCacheDir, 'src'),
        path.join(wallaby.projectCacheDir),
        'node_modules'
      ],
      alias: {
        '@app': path.join(wallaby.projectCacheDir, 'src/app')
      }
    },
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      dns: 'empty'
    }
  });

  return {
    files: [
      'karma.global.js',
      {pattern: 'src/**/*.+(ts|css|less|scss|sass|styl|html|json|svg)', load: false},
      {pattern: 'src/**/*.d.ts', ignore: true},
      {pattern: 'src/**/*spec.ts', ignore: true},
      {pattern: 'projects/**/*.+(ts|css|less|scss|sass|styl|html|json|svg)', load: false},
      {pattern: 'projects/**/*.d.ts', ignore: true},
      {pattern: 'projects/**/*spec.ts', ignore: true}
    ],

    tests: [
      {pattern: 'src/**/*spec.ts', load: false},
      {pattern: 'src/**/*e2e-spec.ts', ignore: true},
      {pattern: 'projects/**/*spec.ts', load: false},
      {pattern: 'projects/**/*e2e-spec.ts', ignore: true}
    ],

    testFramework: 'jasmine',

    compilers: {
      '**/*.ts': wallaby.compilers.typeScript(compilerOptions)
    },

    middleware: function (app, express) {
      var path = require('path');
      app.use('/favicon.ico', express.static(path.join(__dirname, 'src/favicon.ico')));
      app.use('/assets', express.static(path.join(__dirname, 'src/assets')));
    },

    env: {
      kind: 'chrome'
    },

    postprocessor: webpackPostprocessor,

    setup: function () {
      window.__moduleBundler.loadTests();
    },

    debug: true
  };
};
