import loaders from '@velosjs/loaders'

export default async function testFileLoader() {
  const baseDir = './sample'

  console.log('[TEST] Load settings.json')
  const settings = await loaders.fileLoader(baseDir, 'settings.json')
  console.log('[RESULT] settings.json:', settings)

  console.log('[TEST] Load single plugin')
  const plugin = await loaders.fileLoader(baseDir, 'plugins/test.plugin.js')
  console.log('[RESULT] Plugin module:', plugin)
  plugin.run?.()

  console.log('[TEST] Load multiple files')
  const result = await loaders.fileLoader(baseDir, [
    'settings.json',
    'velos.config.js',
    'plugins/plugins.js',
    'modules/testPlugins.js',
  ])
  console.log('[RESULT] Gabungan:', result)
}
