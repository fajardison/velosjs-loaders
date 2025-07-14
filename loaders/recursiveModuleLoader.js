import fs from 'fs/promises'
import path from 'path'
import { pathToFileURL } from 'url'
import validateExtensions from '../validators/validateExtensions.js'
import isAllowedLoader from '../validators/validateAllowedLoader.js'
import { SelfImportHandler } from '../utils/selfImportHandler.js'

/**
 * Memuat modul dari direktori secara rekursif.
 * Modul JS yang valid akan di-import dan:
 * - Didaftarkan ke app (jika `app.register` tersedia), atau
 * - Diproses oleh callback `onLoad`.
 *
 * @param {object} app - Objek aplikasi.
 * @param {string|string[]} dirs - Direktori atau array direktori.
 * @param {(mod: Function, fullPath: string, filename: string) => Promise<void>} [onLoad] - Callback opsional saat modul ditemukan.
 */
export default async function recursiveModuleLoader(app, dirs, onLoad = null) {
  if (!Array.isArray(dirs)) dirs = [dirs]

  const selfImportHandler = new SelfImportHandler({
    loaderUrl: import.meta.url,
    loaderFunctionName: 'recursiveModuleLoader'
  })

  const visited = new Set()

  for (const dir of dirs) {
    const fullPath = path.resolve(dir)
    await loadFromDir(app, fullPath, fullPath, onLoad, visited, selfImportHandler)
  }
}

async function loadFromDir(app, currentDir, baseDir, onLoad, visited, selfImportHandler) {
  if (visited.has(currentDir)) return
  visited.add(currentDir)

  let entries
  try {
    entries = await fs.readdir(currentDir, { withFileTypes: true })
  } catch {
    console.warn(`⚠️ Tidak bisa membaca direktori: ${currentDir}`)
    return
  }

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name)

    if (entry.isDirectory()) {
      if (!isAllowedLoader(entry.name)) continue
      await loadFromDir(app, fullPath, baseDir, onLoad, visited, selfImportHandler)
      continue
    }

    if (!entry.isFile()) continue

    const relativePath = path.relative(baseDir, fullPath)

    let type
    try {
      ({ type } = validateExtensions(relativePath))
    } catch {
      continue
    }

    try {
      const { default: mod } = await import(pathToFileURL(fullPath).href)

      if (selfImportHandler.shouldSkip(fullPath, mod)) {
        console.warn(`⚠️ Lewati "${entry.name}" karena self-import`)
        continue
      }

      if (typeof mod === 'function') {
        if (onLoad) {
          await onLoad(mod, fullPath, entry.name)
        } else if (typeof app.register === 'function') {
          await app.register(mod)
        } else {
          console.warn(`⚠️ app.register() tidak ditemukan. Lewati file "${entry.name}"`)
        }
      }
    } catch (err) {
      console.warn(`⚠️ Lewati "${fullPath}" karena error:\n${err.message}`)
    }
  }
}
