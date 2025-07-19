import { fileLoader } from '@velosjs/loaders'

export default async function () {
  console.log('[TEST] Menjalankan sample loader: fileLoader')

  const data = await fileLoader(process.cwd(), 'sample/settings.json')
  console.log('[RESULT] settings.json:', data)
}
