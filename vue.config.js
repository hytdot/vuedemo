module.exports = {
  outputDir: 'dist',
  lintOnSave: false,
  devServer: {
    open: true,
    host: 'localhost',
    port: '8080',
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8443',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
