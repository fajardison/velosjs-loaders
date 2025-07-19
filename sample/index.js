import testFileLoader from './testFileLoader.js'
import testRecFilesLoader from './testRecFilesLoader.js'
import testPatternLoader from './testPatternFileLoader.js'
import testPluginLoader from './testPluginLoader.js'

async function runAllTests() {
  console.log('🧪 Menjalankan semua pengujian loader...\n')

  try {
    console.log('\n[TEST] fileLoader')
    await testFileLoader()
    console.log('✅ Selesai test fileLoader.\n')

    console.log('\n[TEST] loadModulesRec')
    await testRecFilesLoader()
    console.log('✅ Selesai test loadModulesRec.\n')

    console.log('\n[TEST] patternFileLoader')
    await testPatternLoader()
    console.log('✅ Selesai test patternFileLoader.\n')

    console.log('\n[TEST] pluginsLoader')
    await testPluginLoader()
    console.log('✅ Selesai test pluginsLoader.\n')
    
  } catch (err) {
    console.error('❌ Terjadi kesalahan selama pengujian:', err)
  }
}

runAllTests()
