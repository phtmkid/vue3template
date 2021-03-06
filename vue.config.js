const merge = require('webpack-merge');
const tsImportPluginFactory = require('ts-import-plugin');
const autoprefixer = require('autoprefixer');
const pxtoviewport = require('postcss-px-to-viewport');
const projectSettings = require('./src/settings.js');
const name = projectSettings.title || 'H5-Template'; // page title
const port = 8080; // dev port

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? projectSettings.publicPath : '/',
  parallel: false, // 未配置可能导致build后vantUI 无样式
  lintOnSave: true,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  configureWebpack: {
    // provide the app's title in webpack name field, so that
    name: name,
  },
  chainWebpack: config => {
    config.module
      .rule('ts')
      .use('ts-loader')
      .tap(options => {
        options = merge(options, {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: 'vant',
                libraryDirectory: 'es',
                style: true,
              }),
            ],
          }),
          compilerOptions: {
            module: 'es2015',
          },
        });
        return options;
      });
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtoviewport({
            viewportWidth: 375,
          }),
        ],
      },
    },
  },
};
