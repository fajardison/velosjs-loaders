import loaders from '@velosjs/loaders'

export default async function testRecFilesLoader() {
  const app = {
    modules: [],
    async register(fn) {
      const result = await fn(this)
      this.modules.push(result ?? fn.name ?? 'anonymous')
    }
  }

  console.log('[TEST] Load modules from plugins & modules folder')
  await loaders.recursiveModuleLoader(app, ['./sample/plugins', './sample/modules'])
  console.log('[RESULT] Modul yang dimuat:', app.modules)
}
