import fs from 'fs/promises'
import path from 'path'
import { pathToFileURL } from 'url'
import { SelfImportHandler } from '../utils/selfImportHandler.js'

/**
 * Loader plugin fleksibel.
 * Developer bisa menambahkan plugin dari berbagai sumber melalui `config.pluginSources`.
 *
 * @param {object} config - Konfigurasi aplikasi.
 * @param {object} server - Objek server, biasanya Fastify instance.
 * @param {string} baseDir - Direktori dasar proyek.
 * @param {(baseDir: string, filePath: string) => string} pathResolver - Fungsi untuk resolusi path.
 */
export default async function pluginsLoader(config, server, baseDir, pathResolver) {
  const selfImportHandler = new SelfImportHandler({
    loaderUrl: import.meta.url,
    loaderFunctionName: 'pluginsLoader',
  })

  const sources = config.pluginSources || []

  for (const source of sources) {
    try {
      switch (source.type) {
        case 'inline':
          if (typeof source.handler === 'function') {
            await source.handler(server, config)
          }
          break

        case 'file': {
          const fullPath = pathResolver(baseDir, source.path)
          await registerPluginFromFile(server, fullPath, source.path, selfImportHandler)
          break
        }

        case 'folder': {
          const folderPath = pathResolver(baseDir, source.path)
          const entries = await fs.readdir(folderPath, { withFileTypes: true })
          for (const entry of entries) {
            if (entry.isFile() && entry.name.endsWith('.js')) {
              const filePath = path.join(folderPath, entry.name)
              await registerPluginFromFile(
                server,
                filePath,
                path.join(source.path, entry.name),
                selfImportHandler
              )
            }
          }
          break
        }

        case 'url': {
          console.warn(`[pluginsLoader] Loader dari URL belum didukung secara default: ${source.path}`)
          break
        }

        default:
          console.warn(`[pluginsLoader] Tipe plugin tidak dikenali: ${source.type}`)
      }
    } catch (err) {
      console.error(`[pluginsLoader] Gagal memuat plugin (${source.type}): ${source.path || 'inline'}:`, err)
    }
  }
}

/**
 * Import file modul dan daftarkan ke `server.instance.register`,
 * sekaligus lewati jika file adalah self-import.
 *
 * @param {object} server - Objek server (Fastify).
 * @param {string} fullPath - Path absolut file plugin.
 * @param {string} [nameHint] - Nama referensi untuk log kesalahan.
 * @param {SelfImportHandler} [selfImportHandler] - Objek pemeriksa self-import.
 */
async function registerPluginFromFile(server, fullPath, nameHint = '', selfImportHandler) {
  try {
    const { default: mod } = await import(pathToFileURL(fullPath).href)

    if (selfImportHandler?.shouldSkip(fullPath, mod)) {
      console.warn(`[pluginsLoader] Lewati self-import: ${nameHint}`)
      return
    }

    if (typeof mod === 'function') {
      await server.instance.register(mod)
    }
  } catch (e) {
    console.error(`[pluginsLoader] Gagal import plugin "${nameHint}":`, e)
  }
}
