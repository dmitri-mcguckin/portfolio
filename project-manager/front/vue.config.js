module.exports = {
    devServer: {
      proxy: {
        '^/api': {
          target: 'http://localhost:4000',
          changeorigin: true,
          logLevel: 'debug',
          pathRewrite: { '^/api': '' },
        }
      }
    }
}
