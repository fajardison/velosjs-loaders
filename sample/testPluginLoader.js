import loaders from '@velosjs/loaders'
import path from 'path'

export default async function testPluginLoader() {
  console.log('[TEST] Memuat konfigurasi plugins')

  const [settings, velosConfig] = await loaders.fileLoader('./sample', [
    'settings.json',
    'velos.config.js'
  ])

  const config = {
    ...settings,
    ...velosConfig
  }

  const server = {
    instance: {
      async register(fn) {
        const name = fn.name || 'anonymous'
        console.log(`[REGISTER] Memuat plugin: ${name}`)
        await fn(this)
      }
    }
  }

  const pathResolver = (base, p) => path.resolve(base, p)

  await loaders.pluginsLoader(config, server, './sample', pathResolver)

  console.log('[RESULT] Plugin selesai dimuat.')
}
