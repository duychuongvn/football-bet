module.exports = {
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV !== 'production',
  runtimeCompiler: true,
  configureWebpack: config => {
    config.optimization = {
      mergeDuplicateChunks: true,
      minimize: true,
      removeAvailableModules: true,
      removeEmptyChunks: true,
      runtimeChunk: true,
      noEmitOnErrors: true
    }
  }
}
