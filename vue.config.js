module.exports = {
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV !== 'production',
  runtimeCompiler: true,
  configureWebpack: config => {
    config.optimization = {
      mergeDuplicateChunks: true,
      minimize: process.env.NODE_ENV === 'production',
      removeAvailableModules: true,
      removeEmptyChunks: true
    }
  },
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10240 }))
  }
}
