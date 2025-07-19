import pluginodule from './plugins/plugins.js'

function defineConfig(config) {
  return config
}

export default defineConfig({
  plugins: [pluginodule],
  environment: {
    profiling: false
  },
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  resolve: {
    exportPath: []
  }
})
