import loaders from '@velosjs/loaders'

async function testPatternLoader() {
  const plugins = await loaders.patternFileLoader('./sample/plugins', '*.plugin.js')

  for (const { name, module } of plugins) {
    console.log(`🔌 Plugin ditemukan: ${name}`)
    if (typeof module === 'function') {
      await module({})
    }
  }
}

export default testPatternLoader
